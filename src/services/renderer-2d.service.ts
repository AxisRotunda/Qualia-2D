
import { Injectable } from '@angular/core';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { EngineState2DService } from './engine-state-2d.service';

@Injectable({ providedIn: 'root' })
export class Renderer2DService {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private width = 0;
  private height = 0;

  constructor(
    private store: ComponentStoreService,
    private state: EngineState2DService
  ) {}

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on backbuffer
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
    const zoom = this.state.cameraZoom(); // pixels per meter
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Clear
    ctx.fillStyle = '#0f172a'; // Slate-900
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid
    if (this.state.gridVisible()) {
        this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);
    }

    // Save context for camera transform
    ctx.save();
    
    // Apply Camera: 
    // Screen = (World - Camera) * Zoom + CenterOffset
    // We translate to center, scale by zoom, then translate by negative camera pos
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom); // Flip Y so +Y is up
    ctx.translate(-camX, -camY);

    // Draw Entities
    // Simple painter's algorithm via layer sorting could go here
    this.store.entities.forEach(id => {
        const t = this.store.getTransform(id);
        const s = this.store.getSprite(id);
        
        if (t && s) {
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.rotation);
            
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.opacity;
            
            // Draw centered rect
            ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
            
            // Selection highlight
            if (this.state.selectedEntityId() === id) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 2 / zoom; // Constant screen width
                ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);
            }
            
            ctx.restore();
        }
    });

    ctx.restore();
  }

  private drawGrid(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, halfW: number, halfH: number) {
    ctx.save();
    ctx.strokeStyle = '#1e293b'; // Slate-800
    ctx.lineWidth = 1;

    const gridSize = 1; // 1 meter
    const step = gridSize * zoom;
    
    // Calculate offset to keep grid anchored to world 0,0
    // The screen position of World(0,0) is:
    // ScreenX = (0 - camX) * zoom + halfW
    // ScreenY = (0 - camY) * -zoom + halfH
    
    const offsetX = (-camX * zoom + halfW) % step;
    const offsetY = (camY * zoom + halfH) % step;

    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
    }
    for (let y = offsetY; y < this.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    
    // Axis lines
    const originScreenX = (-camX * zoom + halfW);
    const originScreenY = (camY * zoom + halfH); // Flipped Y
    
    if (originScreenX >= 0 && originScreenX <= this.width) {
        ctx.strokeStyle = '#ef4444'; // Red X Axis
        ctx.beginPath(); ctx.moveTo(originScreenX, 0); ctx.lineTo(originScreenX, this.height); ctx.stroke();
    }
    if (originScreenY >= 0 && originScreenY <= this.height) {
        ctx.strokeStyle = '#22c55e'; // Green Y Axis
        ctx.beginPath(); ctx.moveTo(0, originScreenY); ctx.lineTo(this.width, originScreenY); ctx.stroke();
    }

    ctx.restore();
  }
}
