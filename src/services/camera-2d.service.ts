import { Injectable, signal, inject } from '@angular/core';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

/**
 * Unified Viewport Camera.
 * [HYPER_CORE]: Uses Kalman Fusion for predictive smoothing.
 * [RUN_REF]: Enforces signal-state as the source of truth for UI projection.
 */
@Injectable({ providedIn: 'root' })
export class Camera2DService {
  private kalman = inject(KalmanFilterService);

  readonly x = signal<number>(0);
  readonly y = signal<number>(0);
  readonly zoom = signal<number>(50);
  
  readonly followedEntityId = signal<number | null>(null);
  readonly smoothing = signal<number>(0.12);

  /**
   * Manual Pan: Resets follow state and syncs Kalman seed.
   */
  pan(dx: number, dy: number) {
    this.followedEntityId.set(null);
    this.x.update(val => val + dx);
    this.y.update(val => val + dy);
    this.kalman.calibrate(this.x(), this.y());
  }

  /**
   * [RUN_INDUSTRY]: Pivot Zoom.
   * Keeps world coordinate under pointer stationary during scaling.
   */
  zoomAt(factor: number, worldX: number, worldY: number) {
    const oldZoom = this.zoom();
    const newZoom = Math.max(5, Math.min(500, oldZoom * factor));
    
    if (oldZoom === newZoom) return;
    this.followedEntityId.set(null);

    const ratio = oldZoom / newZoom;
    this.x.set(worldX - (worldX - this.x()) * ratio);
    this.y.set(worldY + (this.y() - worldY) * ratio);
    this.zoom.set(newZoom);
    
    this.kalman.calibrate(this.x(), this.y());
  }

  setZoom(val: number) {
    this.zoom.set(Math.max(5, Math.min(500, val)));
  }

  setAt(x: number, y: number) {
    this.x.set(x);
    this.y.set(y);
    this.kalman.calibrate(x, y);
  }

  updateFollow(targetX: number, targetY: number, dt: number) {
    this.kalman.predict(dt);
    this.kalman.correct(targetX, targetY);
    
    const predicted = this.kalman.getPredictedPosition();
    const s = this.smoothing();
    const lerpFactor = 1 - Math.pow(1 - s, dt * 60);
    
    this.x.update(cx => cx + (predicted.x - cx) * lerpFactor);
    this.y.update(cy => cy + (predicted.y - cy) * lerpFactor);
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