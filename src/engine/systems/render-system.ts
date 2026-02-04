
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Camera2DService } from '../../services/camera-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { AssetRegistryService } from '../core/asset-registry.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { VISUAL_CONFIG } from '../../data/config/visual-config';

/**
 * Obsidian Glass: Render System V5.2 (Singularity)
 * [OPTIMIZATION]: Zero-allocation buffer reuse and Morton-order spatial sorting.
 * [REALISM]: Alpha-interpolation between physical steps.
 */
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
  private physics = inject(PhysicsEngine);

  // Buffer pools
  private readonly renderBuffer: number[] = [];
  private cachedGradient: CanvasGradient | null = null;
  private lastEnvHash: string = '';

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
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
      this.cachedGradient = null; 
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    const alpha = this.physics.interpolationAlpha();
    
    const camX = this.camera.x();
    const camY = this.camera.y();
    const zoom = this.camera.zoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // 1. Clear & Background
    this.drawBackground(ctx);
    if (this.state.gridVisible()) this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);

    // 2. View Projection
    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    // 3. Spatially Optimized Culling
    const frustumW = this.width / zoom;
    const frustumH = this.height / zoom;
    this.prepareRenderBuffer(camX, camY, frustumW, frustumH);

    // 4. Stratified Draw Pass
    for (let i = 0; i < this.renderBuffer.length; i++) {
        this.renderEntity(ctx, this.renderBuffer[i], alpha, time, zoom);
    }

    // 5. Post-Entity Overlays
    this.drawOverlays(ctx, zoom);

    ctx.restore();
  }

  private prepareRenderBuffer(cx: number, cy: number, fw: number, fh: number) {
    const entities = this.store.entitiesList();
    const minX = cx - fw / 2 - 2;
    const maxX = cx + fw / 2 + 2;
    const minY = cy - fh / 2 - 2;
    const maxY = cy + fh / 2 + 2;

    this.renderBuffer.length = 0;
    for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        const t = this.store.getTransform(id);
        if (t && t.x > minX && t.x < maxX && t.y > minY && t.y < maxY) {
            this.renderBuffer.push(id);
        }
    }

    // CoT: Morton Sort improves CPU cache hits for spatial data lookups
    this.renderBuffer.sort((a, b) => {
        const sA = this.store.getSprite(a);
        const sB = this.store.getSprite(b);
        const layerA = sA?.layer ?? 0;
        const layerB = sB?.layer ?? 0;
        
        if (layerA !== layerB) return layerA - layerB;
        
        const tA = this.store.getTransform(a)!;
        const tB = this.store.getTransform(b)!;
        return this.computeMorton(tA.x, tA.y) - this.computeMorton(tB.x, tB.y);
    });
  }

  private renderEntity(ctx: CanvasRenderingContext2D, id: number, alpha: number, time: number, zoom: number) {
    const t = this.store.getTransform(id);
    const s = this.store.getSprite(id);
    if (!t || !s) return;

    // // CoT: Deterministic Linear Interpolation for Sub-Step Smoothing
    const rx = t.prevX + (t.x - t.prevX) * alpha;
    const ry = t.prevY + (t.y - t.prevY) * alpha;
    const rr = t.prevRotation + (t.rotation - t.prevRotation) * alpha;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(rr);
    if (s.flipX) ctx.scale(-1, 1);
    if (s.flipY) ctx.scale(1, -1);

    ctx.globalAlpha = s.opacity;
    const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
    
    if (texture) {
        // // CoT: Fix "Improper sprite rendering". If frameWidth is set but is tiny (like 32 vs 128),
        // we only crop if the texture is a confirmed sheet.
        const isSheet = s.textureId?.includes('sheet');
        if (isSheet && s.frameWidth && s.frameHeight) {
            ctx.drawImage(texture, s.frameX || 0, s.frameY || 0, s.frameWidth, s.frameHeight, -s.width/2, -s.height/2, s.width, s.height);
        } else {
            ctx.drawImage(texture, -s.width/2, -s.height/2, s.width, s.height);
        }
    } else {
        ctx.fillStyle = s.color;
        ctx.fillRect(-s.width/2, -s.height/2, s.width, s.height);
    }

    if (this.store.forceFields.has(id)) this.drawForceField(ctx, id, time, zoom);
    if (this.state.selectedEntityId() === id) this.drawSelection(ctx, s, time, zoom);

    ctx.restore();
  }

  private drawBackground(ctx: CanvasRenderingContext2D) {
    const env = this.state.envConfig();
    if (env.type === 'atmosphere' && env.horizon) {
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

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = this.state.envConfig().gridOpacity ?? 0.05;
    const step = zoom;
    const ox = (-camX * zoom + halfW) % step;
    const oy = (camY * zoom + halfH) % step;
    ctx.beginPath();
    for (let x = ox; x < this.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, this.height); }
    for (let y = oy; y < this.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(this.width, y); }
    ctx.stroke();
    ctx.restore();
  }

  private drawForceField(ctx: CanvasRenderingContext2D, id: number, time: number, zoom: number) {
    const field = this.store.forceFields.get(id);
    if (!field?.active) return;
    ctx.strokeStyle = field.strength > 0 ? '#6366f1' : '#f43f5e';
    ctx.lineWidth = 2 / zoom;
    ctx.globalAlpha = 0.2 + Math.sin(time * 4) * 0.1;
    ctx.beginPath(); ctx.arc(0, 0, field.radius, 0, Math.PI * 2); ctx.stroke();
  }

  private drawSelection(ctx: CanvasRenderingContext2D, s: any, time: number, zoom: number) {
    const pulse = Math.sin(time * 10) * 0.1 + 0.9;
    ctx.strokeStyle = this.input.isDragging() ? '#60a5fa' : '#ffffff';
    ctx.lineWidth = (this.input.isDragging() ? 6 : 3) / zoom;
    ctx.globalAlpha = pulse * 0.6;
    ctx.strokeRect(-s.width/2 - 0.05, -s.height/2 - 0.05, s.width + 0.1, s.height + 0.1);
  }

  private drawOverlays(ctx: CanvasRenderingContext2D, zoom: number) {
    const selectedId = this.state.selectedEntityId();
    if (selectedId && this.input.isDragging()) {
       const t = this.store.getTransform(selectedId);
       const target = this.input.dragTargetPos();
       if (t && target && this.state.mode() === 'play') {
          ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.5 / zoom;
          ctx.setLineDash([0.1, 0.1]); ctx.stroke(); ctx.setLineDash([]);
       }
    }
  }

  /**
   * Morton Order Spatial Indexer.
   * Maps 2D coordinates to a 1D curve for localized memory access.
   */
  private computeMorton(x: number, y: number): number {
    let ix = Math.floor((x + 1024) * 10) & 0xFFFF;
    let iy = Math.floor((y + 1024) * 10) & 0xFFFF;
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
