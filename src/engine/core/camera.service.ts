import { Injectable, signal, inject } from '@angular/core';
import { KalmanFilterService } from './kalman-filter.service';

/**
 * High-Performance Viewport Camera.
 * [HYPER_CORE]: Uses Kalman Fusion to predict entity trajectories for smooth tracking.
 */
@Injectable({ providedIn: 'root' })
export class CameraService {
  private kalman = inject(KalmanFilterService);

  readonly x = signal<number>(0);
  readonly y = signal<number>(0);
  readonly zoom = signal<number>(50);
  
  readonly followedEntityId = signal<number | null>(null);
  readonly smoothing = signal<number>(0.12); // Base Lerp factor

  /**
   * Manual Pan: Resets follow state and syncs Kalman seed.
   */
  pan(dx: number, dy: number) {
    this.followedEntityId.set(null);
    this.x.update(val => val + dx);
    this.y.update(val => val + dy);
    // Recalibrate filter so follow doesn't "snap" back to old predicted velocity
    this.kalman.calibrate(this.x(), this.y());
  }

  setZoom(val: number) {
    this.zoom.set(Math.max(5, Math.min(500, val)));
  }

  /**
   * [RUN_INDUSTRY]: Pivot Zoom.
   * Ensures world coordinates under pointer stay stationary in screen-space during scale.
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

  setAt(x: number, y: number) {
    this.x.set(x);
    this.y.set(y);
    this.kalman.calibrate(x, y);
  }

  /**
   * [HYPER_CORE]: Predictive Entity Tracking.
   * Combines standard Lerp with Kalman Filter prediction to eliminate visual lag.
   */
  updateFollow(targetX: number, targetY: number, dt: number) {
    // 1. Prediction Pass
    this.kalman.predict(dt);
    
    // 2. Correction Pass (Current Frame Target)
    this.kalman.correct(targetX, targetY);
    
    const predicted = this.kalman.getPredictedPosition();
    const s = this.smoothing();
    
    // 3. Temporal Damping (Frame-rate independent)
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