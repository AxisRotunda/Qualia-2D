import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Camera2DService {
  readonly x = signal<number>(0);
  readonly y = signal<number>(0);
  readonly zoom = signal<number>(50);
  
  // Follow Target logic
  readonly followedEntityId = signal<number | null>(null);
  readonly smoothing = signal<number>(0.12); // Lerp factor

  pan(dx: number, dy: number) {
    this.followedEntityId.set(null); // Manual pan breaks follow
    this.x.update(val => val + dx);
    this.y.update(val => val + dy);
  }

  setZoom(val: number) {
    this.zoom.set(Math.max(5, Math.min(500, val)));
  }

  zoomDelta(delta: number) {
    this.setZoom(this.zoom() + delta);
  }

  setAt(x: number, y: number) {
    this.x.set(x);
    this.y.set(y);
  }

  updateFollow(targetX: number, targetY: number, dt: number) {
    const s = this.smoothing();
    // Frame-rate independent lerp
    const lerpFactor = 1 - Math.pow(1 - s, dt * 60);
    
    this.x.update(cx => cx + (targetX - cx) * lerpFactor);
    this.y.update(cy => cy + (targetY - cy) * lerpFactor);
  }

  // INDUSTRY_STANDARD: Coordinate Projection
  screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number) {
    const z = this.zoom();
    const halfW = canvasWidth / 2;
    const halfH = canvasHeight / 2;
    
    const worldX = (screenX - halfW) / z + this.x();
    const worldY = -((screenY - halfH) / z - this.y());
    
    return { x: worldX, y: worldY };
  }
}