import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CameraService {
  readonly x = signal<number>(0);
  readonly y = signal<number>(0);
  readonly zoom = signal<number>(50);
  
  readonly followedEntityId = signal<number | null>(null);
  readonly smoothing = signal<number>(0.12);

  pan(dx: number, dy: number) {
    this.followedEntityId.set(null);
    this.x.update(val => val + dx);
    this.y.update(val => val + dy);
  }

  setZoom(val: number) {
    this.zoom.set(Math.max(5, Math.min(500, val)));
  }

  /**
   * INDUSTRY_STANDARD: Pivot Zoom.
   * Adjusts zoom while counter-panning to keep a specific world point stationary relative to the viewport.
   */
  zoomAt(factor: number, worldX: number, worldY: number) {
    const oldZoom = this.zoom();
    const newZoom = Math.max(5, Math.min(500, oldZoom * factor));
    
    if (oldZoom === newZoom) return;
    this.followedEntityId.set(null);

    const ratio = oldZoom / newZoom;
    
    // Standard X-Axis adjustment
    this.x.set(worldX - (worldX - this.x()) * ratio);
    
    // Adjusted Y-Axis for inverted planar projection (+Y is Up)
    // Formula: CamY_new = WorldY + (CamY_old - WorldY) * (Zoom_old / Zoom_new)
    this.y.set(worldY + (this.y() - worldY) * ratio);
    
    this.zoom.set(newZoom);
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
    const lerpFactor = 1 - Math.pow(1 - s, dt * 60);
    
    this.x.update(cx => cx + (targetX - cx) * lerpFactor);
    this.y.update(cy => cy + (targetY - cy) * lerpFactor);
  }

  screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number) {
    const z = this.zoom();
    const halfW = canvasWidth / 2;
    const halfH = canvasHeight / 2;
    
    const worldX = (screenX - halfW) / z + this.x();
    const worldY = -((screenY - halfH) / z - this.y());
    
    return { x: worldX, y: worldY };
  }
}
