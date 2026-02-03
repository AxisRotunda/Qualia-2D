
import { Injectable, signal, inject } from '@angular/core';
import { GestureOracleService, GestureType } from '../engine/core/gesture-oracle.service';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

export interface Vector2 { x: number; y: number; }
export type InteractionDevice = 'mouse' | 'touch';

export interface RawInputState {
  keys: Set<string>;
  cursorWorld: Vector2;
  isDragging: boolean;
  dragTargetPos: Vector2 | null;
}

/**
 * Unified Input Orchestration Service.
 * Translates hardware events into deterministic engine intent.
 * Now augmented with Gesture Oracle and Kalman Fusion.
 */
@Injectable({ providedIn: 'root' })
export class Input2DService {
  private oracle = inject(GestureOracleService);
  private kalman = inject(KalmanFilterService);

  // Raw Hardware State (Internal)
  private _raw = signal<RawInputState>({
    keys: new Set(),
    cursorWorld: { x: 0, y: 0 },
    isDragging: false,
    dragTargetPos: null
  });

  // Public Accessors (Industry Standard Signals)
  readonly interactionDevice = signal<InteractionDevice>('mouse');
  readonly isUsingJoypad = signal<boolean>(false);
  
  // Normalized Intent Vectors
  readonly moveVector = signal<Vector2>({ x: 0, y: 0 });
  readonly lookVector = signal<Vector2>({ x: 0, y: 0 });
  readonly action = signal<boolean>(false);

  // Expose specific signals for high-frequency consumption
  readonly keys = signal<Set<string>>(new Set());
  readonly cursorWorld = signal<Vector2>({ x: 0, y: 0 });
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<Vector2 | null>(null);

  // Gesture State
  readonly lastGesture = signal<GestureType>(GestureType.NONE);
  private lastCursorTime = 0;

  /**
   * Updates key state with normalization.
   */
  updateKeys(key: string, isDown: boolean) {
    const k = key.toLowerCase();
    this.keys.update(s => {
      const next = new Set(s);
      if (isDown) next.add(k);
      else next.delete(k);
      return next;
    });
    
    // Map Spacebar/E to Action
    if (k === ' ' || k === 'e') {
      this.action.set(isDown);
    }
  }

  /**
   * Sets the world-space cursor position.
   * Applies Kalman filtering for prediction/smoothing.
   */
  setCursor(x: number, y: number) {
    const now = performance.now();
    const dt = (now - this.lastCursorTime) / 1000;
    
    // 1. Kalman Predict Step
    if (dt > 0) {
      this.kalman.predict(dt);
    }
    
    // 2. Kalman Correct Step
    this.kalman.correct(x, y);
    
    // 3. Oracle Classification
    if (dt > 0 && dt < 0.5) {
       const prev = this.cursorWorld();
       const dx = (x - prev.x); 
       const dy = (y - prev.y);
       const gesture = this.oracle.classify(dx, dy, dt);
       if (gesture !== GestureType.NONE) {
         this.lastGesture.set(gesture);
       }
    }

    const smoothPos = this.kalman.getPredictedPosition();
    this.cursorWorld.set(smoothPos);
    this.lastCursorTime = now;
  }

  /**
   * Manages entity dragging state.
   */
  setDragging(active: boolean, pos?: Vector2) {
    this.isDragging.set(active);
    if (pos) {
      this.dragTargetPos.set(pos);
      this.kalman.calibrate(pos.x, pos.y); // Reset filter on new grab
    } else if (!active) {
      this.dragTargetPos.set(null);
    }
  }

  /**
   * Total system reset for input state (used on scene transition).
   */
  reset() {
    this.keys.set(new Set());
    this.moveVector.set({ x: 0, y: 0 });
    this.lookVector.set({ x: 0, y: 0 });
    this.action.set(false);
    this.isUsingJoypad.set(false);
    this.isDragging.set(false);
    this.dragTargetPos.set(null);
    this.kalman.reset();
  }
}