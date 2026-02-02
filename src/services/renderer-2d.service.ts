
import { Injectable } from '@angular/core';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { EngineState2DService } from './engine-state-2d.service';

@Injectable({ providedIn: 'root' })
export class Renderer2DService {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  public width = 0;
  public height = 0;

  constructor(
    private store: ComponentStoreService,
    private state: EngineState2DService
  ) {}

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
    const camX = this.state.cameraX();
    const camY = this.state.cameraY();
    const zoom = this.state.cameraZoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Clear background
    ctx.fillStyle = this.state.bgColor();
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid
    if (this.state.gridVisible()) {
        this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);
    }

    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom);
    ctx.translate(-camX, -camY);

    // Render Entities
    this.store.entitiesList().forEach(id => {
        const t = this.store.getTransform(id);
        const s = this.store.getSprite(id);
        
        if (t && s) {
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.rotation);
            
            // Draw Sprite
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.opacity;
            ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
            
            // Draw Collider Debug
            if (this.state.debugPhysics()) {
                ctx.strokeStyle = '#f0f';
                ctx.lineWidth = 1 / zoom;
                ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
            }

            // Selection Highlight
            if (this.state.selectedEntityId() === id) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 4 / zoom;
                ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
                
                // Corner Indicators
                ctx.fillStyle = '#3b82f6';
                const dotSize = 0.1;
                ctx.fillRect(-s.width/2 - dotSize/2, -s.height/2 - dotSize/2, dotSize, dotSize);
                ctx.fillRect(s.width/2 - dotSize/2, -s.height/2 - dotSize/2, dotSize, dotSize);
                ctx.fillRect(-s.width/2 - dotSize/2, s.height/2 - dotSize/2, dotSize, dotSize);
                ctx.fillRect(s.width/2 - dotSize/2, s.height/2 - dotSize/2, dotSize, dotSize);
            }
            
            ctx.restore();
        }
    });

    ctx.restore();
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
    
    // Axes
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
