
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Camera2DService } from '../../services/camera-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { AssetRegistryService } from '../core/asset-registry.service';
import { VISUAL_CONFIG } from '../../data/config/visual-config';

@Injectable({ providedIn: 'root' })
export class RenderSystem {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  public width = 0;
  public height = 0;

  private store = inject(ComponentStoreService);
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
  private input = inject(Input2DService);
  private assets = inject(AssetRegistryService);

  // Cache gradients to avoid reallocation every frame
  private cachedGradient: CanvasGradient | null = null;
  private lastEnvHash: string = '';

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.cachedGradient = null; // Invalidate cache on resize
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    const camX = this.camera.x();
    const camY = this.camera.y();
    const zoom = this.camera.zoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // [PROTOCOL_VISUAL_CORE] 1. Environment Pass
    this.drawEnvironment(ctx);

    if (this.state.gridVisible()) this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);

    // 2. Simulation World Pass
    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    // Fractal Batch Sorting: Layer -> Morton Code
    const sortedEntities = [...this.store.entitiesList()].sort((a, b) => {
      const layerA = this.store.getSprite(a)?.layer ?? 0;
      const layerB = this.store.getSprite(b)?.layer ?? 0;
      if (layerA !== layerB) return layerA - layerB;
      
      const tA = this.store.getTransform(a);
      const tB = this.store.getTransform(b);
      if (tA && tB) return this.computeMorton(tA.x, tA.y) - this.computeMorton(tB.x, tB.y);
      return 0;
    });

    sortedEntities.forEach(id => {
        const t = this.store.getTransform(id);
        if (!t) return;
        
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        
        this.passSprite(ctx, id, zoom);
        this.passForceField(ctx, id, zoom, time);
        this.passSelectionFeedback(ctx, id, zoom, time);
        
        ctx.restore();
        
        // Draw interaction connectors in world space (unrotated)
        this.passInteractionLeash(ctx, id, zoom, t);
    });

    ctx.restore();
  }

  // --- Specialized Render Passes ---

  private drawEnvironment(ctx: CanvasRenderingContext2D) {
    const env = this.state.envConfig();
    
    if (env.type === 'atmosphere' && env.horizon) {
       // Check Cache
       const hash = `${env.background}-${env.horizon}-${this.height}`;
       if (hash !== this.lastEnvHash || !this.cachedGradient) {
         this.cachedGradient = ctx.createLinearGradient(0, 0, 0, this.height);
         this.cachedGradient.addColorStop(0, env.background);
         this.cachedGradient.addColorStop(1, env.horizon);
         this.lastEnvHash = hash;
       }
       ctx.fillStyle = this.cachedGradient;
    } else {
       ctx.fillStyle = env.background;
    }
    
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private passSprite(ctx: CanvasRenderingContext2D, id: number, zoom: number) {
    const s = this.store.getSprite(id);
    if (!s) return;
    ctx.globalAlpha = s.opacity;
    const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
    if (texture) {
      const sx = s.flipX ? -1 : 1;
      const sy = s.flipY ? -1 : 1;
      if (s.flipX || s.flipY) { ctx.save(); ctx.scale(sx, sy); }
      if (s.frameWidth && s.frameHeight) {
         ctx.drawImage(texture, s.frameX || 0, s.frameY || 0, s.frameWidth, s.frameHeight, -s.width/2, -s.height/2, s.width, s.height);
      } else {
         ctx.drawImage(texture, -s.width/2, -s.height/2, s.width, s.height);
      }
      if (s.flipX || s.flipY) ctx.restore();
    } else {
      ctx.fillStyle = s.color;
      ctx.fillRect(-s.width/2, -s.height/2, s.width, s.height);
    }
    if (this.state.debugPhysics()) {
        ctx.strokeStyle = '#f0f'; ctx.lineWidth = 1/zoom;
        ctx.strokeRect(-s.width/2, -s.height/2, s.width, s.height);
    }
    ctx.globalAlpha = 1.0;
  }

  private passForceField(ctx: CanvasRenderingContext2D, id: number, zoom: number, time: number) {
    const field = this.store.getForceField(id);
    if (!field) return;
    const color = field.strength > 0 ? '#6366f1' : '#f43f5e';
    const pulse = Math.sin(time * 5) * 0.1 + 0.9;
    ctx.strokeStyle = color; ctx.lineWidth = 2/zoom; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(0, 0, field.radius * pulse, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = color; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(0, 0, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  private passSelectionFeedback(ctx: CanvasRenderingContext2D, id: number, zoom: number, time: number) {
    if (this.state.selectedEntityId() !== id) return;
    const isDragging = this.input.isDragging();
    const pulse = Math.sin(time * 12) * 0.2 + 0.8;
    const s = this.store.getSprite(id);
    ctx.strokeStyle = isDragging ? '#60a5fa' : '#ffffff';
    ctx.lineWidth = (isDragging ? 8 : 4) / zoom;
    ctx.globalAlpha = pulse * 0.5;
    if (s) {
        ctx.strokeRect(-s.width/2 - 0.1, -s.height/2 - 0.1, s.width + 0.2, s.height + 0.2);
    }
    ctx.globalAlpha = 1.0;
  }

  private passInteractionLeash(ctx: CanvasRenderingContext2D, id: number, zoom: number, t: any) {
    if (this.state.selectedEntityId() !== id || !this.input.isDragging()) return;
    const target = this.input.dragTargetPos();
    if (target && this.state.mode() === 'play') {
        ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2/zoom;
        ctx.setLineDash([0.1, 0.1]); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    const env = this.state.envConfig();
    const opacity = env.gridOpacity !== undefined ? env.gridOpacity : 0.1;
    
    ctx.save();
    ctx.strokeStyle = '#ffffff'; 
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity;
    
    const step = zoom;
    const offsetX = (-camX * zoom + halfW) % step;
    const offsetY = (camY * zoom + halfH) % step;
    
    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, this.height); }
    for (let y = offsetY; y < this.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(this.width, y); }
    ctx.stroke();
    ctx.restore();
  }

  private computeMorton(x: number, y: number): number {
    let ix = Math.floor((x + 1000) * 10) & 0xFFFF;
    let iy = Math.floor((y + 1000) * 10) & 0xFFFF;
    const interleave = (val: number) => {
        val = (val | (val << 8)) & 0x00FF00FF;
        val = (val | (val << 4)) & 0x0F0F0F0F;
        val = (val | (val << 2)) & 0x33333333;
        val = (val | (val << 1)) & 0x55555555;
        return val;
    };
    return interleave(ix) | (interleave(iy) << 1);
  }
}