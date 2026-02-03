import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { Input2DService } from './input-2d.service';
import { AssetRegistryService } from './asset-registry.service';

@Injectable({ providedIn: 'root' })
export class Renderer2DService {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  public width = 0;
  public height = 0;

  private store = inject(ComponentStoreService);
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
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

    // 1. Clear & Grid
    ctx.fillStyle = this.state.bgColor();
    ctx.fillRect(0, 0, this.width, this.height);
    if (this.state.gridVisible()) this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);

    // 2. Scene Transform
    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    const time = performance.now() / 1000;

    // 3. Entity Loop (INDUSTRY_STANDARD: Sorted by Layer)
    const sortedEntities = [...this.store.entitiesList()].sort((a, b) => {
      const layerA = this.store.getSprite(a)?.layer ?? 0;
      const layerB = this.store.getSprite(b)?.layer ?? 0;
      return layerA - layerB;
    });

    sortedEntities.forEach(id => {
        const t = this.store.getTransform(id);
        if (!t) return;

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        
        this.drawSprite(ctx, id, zoom);
        this.drawForceField(ctx, id, zoom, time);
        this.drawHighlight(ctx, id, zoom, time);
        
        ctx.restore();

        this.drawDragLeash(ctx, id, zoom, t);
    });

    ctx.restore();
  }

  private drawSprite(ctx: CanvasRenderingContext2D, id: number, zoom: number) {
    const s = this.store.getSprite(id);
    if (!s) return;
    
    ctx.globalAlpha = s.opacity;
    
    // Check for Texture
    const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
    
    if (texture) {
      // Texture Rendering with Flipped logic
      const scaleX = s.flipX ? -1 : 1;
      const scaleY = s.flipY ? -1 : 1;
      
      if (s.flipX || s.flipY) {
        ctx.save();
        ctx.scale(scaleX, scaleY);
      }
      
      ctx.drawImage(texture, -s.width / 2, -s.height / 2, s.width, s.height);
      
      if (s.flipX || s.flipY) {
        ctx.restore();
      }
    } else {
      // Solid Fallback
      ctx.fillStyle = s.color;
      ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
    }
    
    if (this.state.debugPhysics()) {
        ctx.strokeStyle = '#f0f';
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
    }
    ctx.globalAlpha = 1.0;
  }

  private drawForceField(ctx: CanvasRenderingContext2D, id: number, zoom: number, time: number) {
    const field = this.store.getForceField(id);
    if (!field) return;

    const color = field.strength > 0 ? '#6366f1' : '#f43f5e';
    const pulse = Math.sin(time * 5) * 0.1 + 0.9;
    
    ctx.strokeStyle = color;
    ctx.setLineDash([0.1, 0.1]);
    ctx.lineWidth = 2 / zoom;
    ctx.globalAlpha = 0.3;
    
    ctx.beginPath();
    ctx.arc(0, 0, field.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  private drawHighlight(ctx: CanvasRenderingContext2D, id: number, zoom: number, time: number) {
    if (this.state.selectedEntityId() !== id) return;

    const isDragging = this.input.isDragging();
    const pulse = Math.sin(time * 12) * 0.2 + 0.8;
    const s = this.store.getSprite(id);
    
    ctx.strokeStyle = isDragging ? '#60a5fa' : '#3b82f6';
    ctx.lineWidth = (isDragging ? 8 : 4) / zoom;
    ctx.setLineDash([]);
    ctx.globalAlpha = pulse * 0.5;
    
    if (s) {
        ctx.strokeRect(-s.width / 2 - 0.1, -s.height / 2 - 0.1, s.width + 0.2, s.height + 0.2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1 / zoom;
        ctx.globalAlpha = 1.0;
        ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, 0.35, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  private drawDragLeash(ctx: CanvasRenderingContext2D, id: number, zoom: number, t: any) {
    if (this.state.selectedEntityId() !== id || !this.input.isDragging()) return;
    
    const target = this.input.dragTargetPos();
    if (target && this.state.mode() === 'play') {
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([0.1, 0.1]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    ctx.save();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 1;
    const step = gridSize * zoom;
    const offsetX = (-camX * zoom + halfW) % step;
    const offsetY = (camY * zoom + halfH) % step;

    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += step) {
        ctx.moveTo(x, 0); ctx.lineTo(x, this.height);
    }
    for (let y = offsetY; y < this.height; y += step) {
        ctx.moveTo(0, y); ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    
    const originScreenX = (-camX * zoom + halfW);
    const originScreenY = (camY * zoom + halfH);
    if (originScreenX >= 0 && originScreenX <= this.width) {
        ctx.strokeStyle = '#ef444466';
        ctx.beginPath(); ctx.moveTo(originScreenX, 0); ctx.lineTo(originScreenX, this.height); ctx.stroke();
    }
    if (originScreenY >= 0 && originScreenY <= this.height) {
        ctx.strokeStyle = '#22c55e66';
        ctx.beginPath(); ctx.moveTo(0, originScreenY); ctx.lineTo(this.width, originScreenY); ctx.stroke();
    }
    ctx.restore();
  }
}