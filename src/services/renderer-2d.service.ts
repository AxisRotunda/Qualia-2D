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

    const time = performance.now() / 1000;

    // Render Entities
    this.store.entitiesList().forEach(id => {
        const t = this.store.getTransform(id);
        const s = this.store.getSprite(id);
        const field = this.store.getForceField(id);
        
        if (t) {
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.rotation);
            
            // 1. Render Sprites
            if (s) {
                ctx.fillStyle = s.color;
                ctx.globalAlpha = s.opacity;
                ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
                
                if (this.state.debugPhysics()) {
                    ctx.strokeStyle = '#f0f';
                    ctx.lineWidth = 1 / zoom;
                    ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
                }
            }

            // 2. Render Force Fields
            if (field) {
                const color = field.strength > 0 ? '#6366f1' : '#f43f5e';
                const pulse = Math.sin(time * 5) * 0.1 + 0.9;
                
                ctx.strokeStyle = color;
                ctx.setLineDash([0.1, 0.1]);
                ctx.lineWidth = 2 / zoom;
                ctx.globalAlpha = 0.3;
                
                ctx.beginPath();
                ctx.arc(0, 0, field.radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
                
                // Center Core
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(0, 0, 0.1, 0, Math.PI * 2);
                ctx.fill();
            }

            // 3. Selection Highlight
            if (this.state.selectedEntityId() === id) {
                const isDragging = this.state.isDragging();
                const pulse = Math.sin(time * 10) * 0.2 + 0.8;
                
                ctx.strokeStyle = isDragging ? '#60a5fa' : '#3b82f6';
                ctx.lineWidth = (isDragging ? 6 : 4) / zoom;
                ctx.setLineDash([]);
                ctx.globalAlpha = pulse;
                
                if (s) {
                    ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
                } else if (field) {
                    ctx.beginPath();
                    ctx.arc(0, 0, 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1.0;
            }
            
            ctx.restore();

            // 4. Render Drag Leash
            if (this.state.selectedEntityId() === id && this.state.isDragging()) {
                const target = this.state.dragTargetPos();
                if (target && this.state.mode() === 'play') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(t.x, t.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.strokeStyle = '#60a5fa';
                    ctx.lineWidth = 2 / zoom;
                    ctx.setLineDash([0.1, 0.1]);
                    ctx.stroke();
                    ctx.restore();
                }
            }
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