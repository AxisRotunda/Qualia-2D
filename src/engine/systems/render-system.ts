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

  /**
   * [FRACTAL_BATCHING] Computes Morton Code for 2D coordinates.
   */
  private computeMorton(x: number, y: number): number {
    let ix = Math.floor((x + 1000) * 10) & 0xFFFF;
    let iy = Math.floor((y + 1000) * 10) & 0xFFFF;
    ix = (ix | (ix << 8)) & 0x00FF00FF;
    ix = (ix | (ix << 4)) & 0x0F0F0F0F;
    ix = (ix | (ix << 2)) & 0x33333333;
    ix = (ix | (ix << 1)) & 0x55555555;
    iy = (iy | (iy << 8)) & 0x00FF00FF;
    iy = (iy | (iy << 4)) & 0x0F0F0F0F;
    iy = (iy | (iy << 2)) & 0x33333333;
    iy = (iy | (iy << 1)) & 0x55555555;
    return ix | (iy << 1);
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const camX = this.camera.x();
    const camY = this.camera.y();
    const zoom = this.camera.zoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    ctx.fillStyle = this.state.bgColor();
    ctx.fillRect(0, 0, this.width, this.height);
    if (this.state.gridVisible()) this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);

    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    const time = performance.now() / 1000;

    const sortedEntities = [...this.store.entitiesList()].sort((a, b) => {
      const spriteA = this.store.getSprite(a);
      const spriteB = this.store.getSprite(b);
      const layerA = spriteA?.layer ?? VISUAL_CONFIG.LAYERS.BACKGROUND;
      const layerB = spriteB?.layer ?? VISUAL_CONFIG.LAYERS.BACKGROUND;
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
    const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
    if (texture) {
      const scaleX = s.flipX ? -1 : 1;
      const scaleY = s.flipY ? -1 : 1;
      if (s.flipX || s.flipY) { ctx.save(); ctx.scale(scaleX, scaleY); }
      if (s.frameWidth !== undefined && s.frameHeight !== undefined) {
         ctx.drawImage(texture, s.frameX ?? 0, s.frameY ?? 0, s.frameWidth, s.frameHeight, -s.width / 2, -s.height / 2, s.width, s.height);
      } else {
         ctx.drawImage(texture, -s.width / 2, -s.height / 2, s.width, s.height);
      }
      if (s.flipX || s.flipY) { ctx.restore(); }
    } else {
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
    const pulse = Math.sin(time * VISUAL_CONFIG.HIGHLIGHT.PULSE_SPEED) * 0.2 + 0.8;
    const s = this.store.getSprite(id);
    ctx.strokeStyle = isDragging ? VISUAL_CONFIG.HIGHLIGHT.COLORS.DRAGGING : VISUAL_CONFIG.HIGHLIGHT.COLORS.IDLE;
    ctx.lineWidth = (isDragging ? 8 : 4) / zoom;
    ctx.setLineDash([]);
    ctx.globalAlpha = pulse * VISUAL_CONFIG.HIGHLIGHT.GLOW_STRENGTH;
    if (s) {
        ctx.strokeRect(-s.width / 2 - 0.1, -s.height / 2 - 0.1, s.width + 0.2, s.height + 0.2);
        ctx.strokeStyle = VISUAL_CONFIG.HIGHLIGHT.COLORS.INNER;
        ctx.lineWidth = 1 / zoom;
        ctx.globalAlpha = 1.0;
        ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
    } else {
        ctx.beginPath(); ctx.arc(0, 0, 0.35, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  private drawDragLeash(ctx: CanvasRenderingContext2D, id: number, zoom: number, t: any) {
    if (this.state.selectedEntityId() !== id || !this.input.isDragging()) return;
    const target = this.input.dragTargetPos();
    if (target && this.state.mode() === 'play') {
        ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = VISUAL_CONFIG.HIGHLIGHT.COLORS.DRAGGING;
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([0.1, 0.1]);
        ctx.stroke(); ctx.setLineDash([]);
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    ctx.save();
    ctx.strokeStyle = VISUAL_CONFIG.GRID.COLORS.MINOR;
    ctx.lineWidth = VISUAL_CONFIG.GRID.THICKNESS;
    const step = VISUAL_CONFIG.GRID.SIZE * zoom;
    const offsetX = (-camX * zoom + halfW) % step;
    const offsetY = (camY * zoom + halfH) % step;
    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, this.height); }
    for (let y = offsetY; y < this.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(this.width, y); }
    ctx.stroke();
    const originScreenX = (-camX * zoom + halfW);
    const originScreenY = (camY * zoom + halfH);
    if (originScreenX >= 0 && originScreenX <= this.width) {
        ctx.strokeStyle = VISUAL_CONFIG.GRID.COLORS.X_AXIS;
        ctx.beginPath(); ctx.moveTo(originScreenX, 0); ctx.lineTo(originScreenX, this.height); ctx.stroke();
    }
    if (originScreenY >= 0 && originScreenY <= this.height) {
        ctx.strokeStyle = VISUAL_CONFIG.GRID.COLORS.Y_AXIS;
        ctx.beginPath(); ctx.moveTo(0, originScreenY); ctx.lineTo(this.width, originScreenY); ctx.stroke();
    }
    ctx.restore();
  }
}
