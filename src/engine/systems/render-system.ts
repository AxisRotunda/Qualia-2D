import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { CameraService } from '../core/camera.service';
import { Input2DService } from '../../services/input-2d.service';
import { AssetRegistryService } from '../core/asset-registry.service';

@Injectable({ providedIn: 'root' })
export class RenderSystem {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  public width = 0;
  public height = 0;

  private store = inject(ComponentStoreService);
  private state = inject(EngineState2DService);
  private camera = inject(CameraService);
  private input = inject(Input2DService);
  private assets = inject(AssetRegistryService);

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
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const camX = this.camera.x();
    const camY = this.camera.y();
    const zoom = this.camera.zoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    const time = performance.now() / 1000;

    // 1. Clear Frame
    ctx.fillStyle = this.state.bgColor();
    ctx.fillRect(0, 0, this.width, this.height);
    
    // 2. Grid Layer
    if (this.state.gridVisible()) {
        this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);
    }

    // 3. Project Reality
    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    // Sorted Entity Pass
    const entities = [...this.store.entitiesList()].sort((a, b) => {
      const layerA = this.store.getSprite(a)?.layer ?? 0;
      const layerB = this.store.getSprite(b)?.layer ?? 0;
      return layerA - layerB;
    });

    for (const id of entities) {
        const t = this.store.getTransform(id);
        if (!t) continue;

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        
        this.drawEntityVisuals(ctx, id, zoom, time);
        
        ctx.restore();

        this.drawInteractionOverlays(ctx, id, zoom, t);
    }

    ctx.restore();
  }

  private drawEntityVisuals(ctx: CanvasRenderingContext2D, id: number, zoom: number, time: number) {
      const s = this.store.getSprite(id);
      const force = this.store.getForceField(id);
      
      // Forces (Low Alpha Underlay)
      if (force) {
         this.drawForceFieldIndicator(ctx, force, zoom, time);
      }

      // Main Sprite Pass
      if (s) {
        ctx.globalAlpha = s.opacity;
        const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
        
        // Emissive Bloom logic
        const isEmissive = s.color === '#6366f1' || s.color === '#f43f5e' || s.color === '#10b981';
        if (isEmissive) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = s.color;
        }

        if (texture) {
            if (s.flipX || s.flipY) {
              ctx.save();
              ctx.scale(s.flipX ? -1 : 1, s.flipY ? -1 : 1);
            }
            ctx.drawImage(texture, -s.width/2, -s.height/2, s.width, s.height);
            if (s.flipX || s.flipY) ctx.restore();
        } else {
            ctx.fillStyle = s.color;
            ctx.fillRect(-s.width/2, -s.height/2, s.width, s.height);
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // Physics Debug Overlays
      if (this.state.debugPhysics()) {
        const sW = s ? s.width : 1;
        const sH = s ? s.height : 1;
        ctx.strokeStyle = '#f0f';
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(-sW/2, -sH/2, sW, sH);
      }

      // Selection Brackets
      if (this.state.selectedEntityId() === id) {
         this.drawSelectionBracket(ctx, s ? s.width : 1, s ? s.height : 1, zoom, time);
      }
  }

  private drawForceFieldIndicator(ctx: CanvasRenderingContext2D, field: any, zoom: number, time: number) {
    const color = field.strength > 0 ? '#6366f1' : '#f43f5e';
    const pulse = Math.sin(time * 6) * 0.1 + 0.9;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / zoom;
    ctx.globalAlpha = 0.25;
    
    ctx.beginPath();
    ctx.arc(0, 0, field.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    const grad = ctx.createRadialGradient(0,0,0,0,0,field.radius);
    grad.addColorStop(0, color + '00');
    grad.addColorStop(1, color + '20');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0,0,field.radius, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  private drawSelectionBracket(ctx: CanvasRenderingContext2D, w: number, h: number, zoom: number, time: number) {
    const color = this.input.isDragging() ? '#60a5fa' : '#3b82f6';
    const pad = 0.15;
    const size = 0.35;
    const hw = w/2 + pad;
    const hh = h/2 + pad;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3 / zoom;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    // Top Left
    ctx.moveTo(-hw + size, -hh); ctx.lineTo(-hw, -hh); ctx.lineTo(-hw, -hh + size);
    // Top Right
    ctx.moveTo(hw - size, -hh); ctx.lineTo(hw, -hh); ctx.lineTo(hw, -hh + size);
    // Bottom Left
    ctx.moveTo(-hw + size, hh); ctx.lineTo(-hw, hh); ctx.lineTo(-hw, hh - size);
    // Bottom Right
    ctx.moveTo(hw - size, hh); ctx.lineTo(hw, hh); ctx.lineTo(hw, hh - size);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  private drawInteractionOverlays(ctx: CanvasRenderingContext2D, id: number, zoom: number, t: any) {
    if (this.state.selectedEntityId() !== id || !this.input.isDragging()) return;
    const target = this.input.dragTargetPos();
    if (target && this.state.mode() === 'play') {
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([0.1, 0.1]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath(); ctx.arc(target.x, target.y, 0.1, 0, Math.PI*2); ctx.fill();
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    
    const gridSize = 1;
    const step = gridSize * zoom;
    const offsetX = (-camX * zoom + halfW) % step;
    const offsetY = (camY * zoom + halfH) % step;
    
    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, this.height); }
    for (let y = offsetY; y < this.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(this.width, y); }
    ctx.stroke();
    
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    const ox = (-camX * zoom + halfW);
    const oy = (camY * zoom + halfH);
    
    if (ox >= 0 && ox <= this.width) { ctx.strokeStyle = '#22c55e'; ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, this.height); ctx.stroke(); }
    if (oy >= 0 && oy <= this.height) { ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(this.width, oy); ctx.stroke(); }
    
    ctx.restore();
  }
}