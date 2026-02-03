import { Injectable, signal, inject } from '@angular/core';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

@Injectable({ providedIn: 'root' })
export class Camera2DService {
  private kalman = inject(KalmanFilterService);

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
    // Sync Kalman state to manual pan to prevent jumps when re-engaging follow
    this.kalman.calibrate(this.x(), this.y());
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
    this.kalman.calibrate(x, y);
  }

  updateFollow(targetX: number, targetY: number, dt: number) {
    // [HYPER_CORE] Use Kalman Filter for predictive smoothing
    this.kalman.predict(dt);
    this.kalman.correct(targetX, targetY);
    
    const predicted = this.kalman.getPredictedPosition();
    
    // Blend Kalman prediction with standard Lerp for "Weighty" feel
    const s = this.smoothing();
    const lerpFactor = 1 - Math.pow(1 - s, dt * 60);
    
    this.x.update(cx => cx + (predicted.x - cx) * lerpFactor);
    this.y.update(cy => cy + (predicted.y - cy) * lerpFactor);
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