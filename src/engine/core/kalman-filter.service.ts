import { Injectable } from '@angular/core';

/**
 * SIMD-Mimic Kalman Fusion.
 * Uses Float32Array for state management to avoid GC overhead.
 * Optimized for 2D trajectory prediction (Cursor/Camera).
 */
@Injectable({ providedIn: 'root' })
export class KalmanFilterService {
  // State Vector [x, y, vx, vy]
  private state = new Float32Array(4);
  
  // Covariance Matrix (Diagonal approximation for performance)
  private P = new Float32Array([1, 1, 1, 1]); 
  
  // Process Noise
  private Q = new Float32Array([0.01, 0.01, 0.1, 0.1]); 
  
  // Measurement Noise
  private R = new Float32Array([0.1, 0.1]);

  constructor() {
    this.reset();
  }

  reset() {
    this.state.fill(0);
    this.P.fill(1);
  }

  /**
   * [RUN_KALMAN_CALIB]
   * Resets and seeds the filter at a known location.
   */
  calibrate(x: number, y: number) {
    this.state[0] = x;
    this.state[1] = y;
    this.state[2] = 0;
    this.state[3] = 0;
    this.P.fill(1);
  }

  /**
   * Predicts the next state based on dt.
   * x' = x + vx*dt
   * y' = y + vy*dt
   */
  predict(dt: number) {
    // Unrolled Matrix Multiplication
    this.state[0] += this.state[2] * dt;
    this.state[1] += this.state[3] * dt;
    
    // Covariance Update P = F*P*F' + Q
    this.P[0] += this.P[2] * dt * dt + this.Q[0];
    this.P[1] += this.P[3] * dt * dt + this.Q[1];
    this.P[2] += this.Q[2];
    this.P[3] += this.Q[3];
  }

  /**
   * Corrects state based on measurement.
   */
  correct(mx: number, my: number) {
    // Kalman Gain K = P / (P + R)
    const kx = this.P[0] / (this.P[0] + this.R[0]);
    const ky = this.P[1] / (this.P[1] + this.R[1]);

    // State Update x = x + K(z - x)
    this.state[0] += kx * (mx - this.state[0]);
    this.state[1] += ky * (my - this.state[1]);
    
    // Velocity implicit update via residual (simplified)
    this.state[2] += kx * (mx - this.state[0]); 
    this.state[3] += ky * (my - this.state[1]);

    // Covariance Update P = (I - K)P
    this.P[0] *= (1 - kx);
    this.P[1] *= (1 - ky);
  }

  getPredictedPosition(): { x: number, y: number } {
    return { x: this.state[0], y: this.state[1] };
  }
}