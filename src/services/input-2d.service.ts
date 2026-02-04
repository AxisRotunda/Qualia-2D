import { Injectable, signal, inject } from '@angular/core';
import { GestureOracleService, GestureType } from '../engine/core/gesture-oracle.service';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

export interface Vector2 { x: number; y: number; }
export type InteractionDevice = 'mouse' | 'touch';

/**
 * Unified Input Orchestration Service.
 * [HtT]: Extended with jump signal for deterministic kinetic triggers.
 */
@Injectable({ providedIn: 'root' })
export class Input2DService {
  private oracle = inject(GestureOracleService);
  private kalman = inject(KalmanFilterService);

  readonly interactionDevice = signal<InteractionDevice>('mouse');
  readonly isUsingJoypad = signal<boolean>(false);
  
  readonly moveVector = signal<Vector2>({ x: 0, y: 0 });
  readonly lookVector = signal<Vector2>({ x: 0, y: 0 });
  readonly action = signal<boolean>(false);
  readonly jump = signal<boolean>(false); // Dedicated jump state

  readonly cursorWorld = signal<Vector2>({ x: 0, y: 0 });
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<Vector2 | null>(null);

  readonly lastGesture = signal<GestureType>(GestureType.NONE);
  private lastCursorTime = 0;

  updateKeys(key: string, isDown: boolean) {
    const k = key.toLowerCase();
    
    // Jump Mapping: Space or W
    if (k === ' ' || k === 'w') {
      this.jump.set(isDown);
    }

    // Action Mapping: E
    if (k === 'e') {
      this.action.set(isDown);
    }
    
    // Note: moveVector for keys is typically handled by a polling system or refined keyboard service.
    // For now, we preserve basic signal updates.
  }

  setCursor(x: number, y: number) {
    const now = performance.now();
    const dt = (now - this.lastCursorTime) / 1000;
    if (dt > 0) this.kalman.predict(dt);
    this.kalman.correct(x, y);
    
    if (dt > 0 && dt < 0.5) {
       const prev = this.cursorWorld();
       const dx = (x - prev.x); 
       const dy = (y - prev.y);
       const gesture = this.oracle.classify(dx, dy, dt);
       if (gesture !== GestureType.NONE) this.lastGesture.set(gesture);
    }

    this.cursorWorld.set(this.kalman.getPredictedPosition());
    this.lastCursorTime = now;
  }

  setDragging(active: boolean, pos?: Vector2) {
    this.isDragging.set(active);
    if (pos) {
      this.dragTargetPos.set(pos);
      this.kalman.calibrate(pos.x, pos.y);
    } else if (!active) {
      this.dragTargetPos.set(null);
    }
  }

  reset() {
    this.moveVector.set({ x: 0, y: 0 });
    this.lookVector.set({ x: 0, y: 0 });
    this.action.set(false);
    this.jump.set(false);
    this.isUsingJoypad.set(false);
    this.isDragging.set(false);
    this.kalman.reset();
  }
}