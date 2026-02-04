import { Injectable } from '@angular/core';

/**
 * SIMD-Mimic Kalman Fusion V2.0
 * [OPTIMIZATION]: Uses Float32Array for state management to avoid GC overhead.
 * [REALISM]: Predictive trajectory filtering for camera and cursor.
 */
@Injectable({ providedIn: 'root' })
export class KalmanFilterService {
  // Memory-aligned buffers [x, y, vx, vy]
  private state = new Float32Array(4);
  private P = new Float32Array([1, 1, 1, 1]); 
  private Q = new Float32Array([0.01, 0.01, 0.1, 0.1]); 
  private R = new Float32Array([0.05, 0.05]); // Measurement variance

  constructor() {
    this.reset();
  }

  reset() {
    this.state.fill(0);
    this.P.fill(1);
  }

  calibrate(x: number, y: number) {
    this.state[0] = x;
    this.state[1] = y;
    this.state[2] = 0;
    this.state[3] = 0;
    this.P.fill(1);
  }

  /**
   * Predicts next state (x' = x + v*dt).
   * Unrolled matrix multiplication for zero-allocation performance.
   */
  predict(dt: number) {
    // State Prediction
    this.state[0] += this.state[2] * dt;
    this.state[1] += this.state[3] * dt;
    
    // Covariance Prediction
    this.P[0] += this.P[2] * dt * dt + this.Q[0];
    this.P[1] += this.P[3] * dt * dt + this.Q[1];
    this.P[2] += this.Q[2];
    this.P[3] += this.Q[3];
  }

  /**
   * Corrects state based on observation MX, MY.
   */
  correct(mx: number, my: number) {
    // Innovation (Residual)
    const rx = mx - this.state[0];
    const ry = my - this.state[1];

    // Kalman Gain (Simplified diagonal)
    const kx = this.P[0] / (this.P[0] + this.R[0]);
    const ky = this.P[1] / (this.P[1] + this.R[1]);

    // Update State
    this.state[0] += kx * rx;
    this.state[1] += ky * ry;
    
    // Implicit Velocity update from innovation
    this.state[2] += kx * (rx / 0.016); // Assuming 60Hz delta approximation
    this.state[3] += ky * (ry / 0.016);

    // Update Covariance
    this.P[0] *= (1 - kx);
    this.P[1] *= (1 - ky);
  }

  getPredictedPosition(): { x: number, y: number } {
    return { x: this.state[0], y: this.state[1] };
  }
}