// /src/services/input-2d.service.ts

import { Injectable, signal, inject, computed } from '@angular/core';
import { GestureOracleService, GestureType } from '../engine/core/gesture-oracle.service';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

export interface Vector2 { x: number; y: number; }
export type InteractionDevice = 'mouse' | 'touch';

interface KeyState {
  isDown: boolean;
  timestamp: number;
  wasPressed: boolean;
}

/**
 * Unified Input Orchestration Service V2.0
 * [ENHANCED]: Input buffering, key state tracking, validation
 */
@Injectable({ providedIn: 'root' })
export class Input2DService {
  private readonly oracle = inject(GestureOracleService);
  private readonly kalman = inject(KalmanFilterService);

  // Constants
  private readonly INPUT_BUFFER_TIME = 150;
  private readonly KEY_REPEAT_THRESHOLD = 16;
  private readonly CURSOR_UPDATE_THROTTLE = 0.5;

  // Key Mappings
  private readonly JUMP_KEYS = new Set([' ', 'w', 'arrowup']);
  private readonly ACTION_KEYS = new Set(['e', 'enter']);

  // Interaction State
  readonly interactionDevice = signal<InteractionDevice>('mouse');
  readonly isUsingJoypad = signal<boolean>(false);
  
  // Movement Vectors
  readonly moveVector = signal<Vector2>({ x: 0, y: 0 });
  readonly lookVector = signal<Vector2>({ x: 0, y: 0 });
  
  // Actions
  readonly action = signal<boolean>(false);
  readonly jump = signal<boolean>(false);
  readonly actionBuffered = signal<boolean>(false);
  readonly jumpBuffered = signal<boolean>(false);

  // Cursor State
  readonly cursorWorld = signal<Vector2>({ x: 0, y: 0 });
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<Vector2 | null>(null);
  readonly lastGesture = signal<GestureType>(GestureType.NONE);

  // Computed
  readonly isMoving = computed(() => {
    const mv = this.moveVector();
    return mv.x !== 0 || mv.y !== 0;
  });

  // Private State
  private keyStates = new Map<string, KeyState>();
  private lastCursorTime = 0;
  private jumpBufferTimer = 0;
  private actionBufferTimer = 0;

  updateKeys(key: string, isDown: boolean): void {
    const k = key.toLowerCase();
    const now = performance.now();
    
    const currentState = this.keyStates.get(k);
    const wasDown = currentState?.isDown ?? false;
    
    // Prevent key repeat on hold (only trigger once per press)
    if (isDown && wasDown) {
      if (currentState && (now - currentState.timestamp) < this.KEY_REPEAT_THRESHOLD) {
        return;
      }
    }

    this.keyStates.set(k, {
      isDown,
      timestamp: now,
      wasPressed: isDown && !wasDown
    });

    // Jump Mapping
    if (this.JUMP_KEYS.has(k)) {
      this.jump.set(isDown);
      if (isDown) {
        this.jumpBuffered.set(true);
        this.jumpBufferTimer = now;
      }
    }

    // Action Mapping
    if (this.ACTION_KEYS.has(k)) {
      this.action.set(isDown);
      if (isDown) {
        this.actionBuffered.set(true);
        this.actionBufferTimer = now;
      }
    }
  }

  setCursor(x: number, y: number): void {
    if (!this.validateCursorPosition(x, y)) return;

    const now = performance.now();
    const dt = (now - this.lastCursorTime) / 1000;
    
    if (dt > 0) {
      this.kalman.predict(dt);
    }
    
    this.kalman.correct(x, y);
    
    if (dt > 0 && dt < this.CURSOR_UPDATE_THROTTLE) {
      const prev = this.cursorWorld();
      const dx = x - prev.x;
      const dy = y - prev.y;
      const gesture = this.oracle.classify(dx, dy, dt);
      
      if (gesture !== GestureType.NONE) {
        this.lastGesture.set(gesture);
      }
    }

    this.cursorWorld.set(this.kalman.getPredictedPosition());
    this.lastCursorTime = now;
  }

  setDragging(active: boolean, pos?: Vector2): void {
    this.isDragging.set(active);
    
    if (pos && this.validateCursorPosition(pos.x, pos.y)) {
      this.dragTargetPos.set(pos);
      this.kalman.calibrate(pos.x, pos.y);
    } else if (!active) {
      this.dragTargetPos.set(null);
    }
  }

  consumeJumpBuffer(): boolean {
    if (this.jumpBuffered()) {
      this.jumpBuffered.set(false);
      return true;
    }
    return false;
  }

  consumeActionBuffer(): boolean {
    if (this.actionBuffered()) {
      this.actionBuffered.set(false);
      return true;
    }
    return false;
  }

  updateBuffers(currentTime: number): void {
    if (this.jumpBuffered() && (currentTime - this.jumpBufferTimer) > this.INPUT_BUFFER_TIME) {
      this.jumpBuffered.set(false);
    }
    
    if (this.actionBuffered() && (currentTime - this.actionBufferTimer) > this.INPUT_BUFFER_TIME) {
      this.actionBuffered.set(false);
    }
  }

  isKeyDown(key: string): boolean {
    return this.keyStates.get(key.toLowerCase())?.isDown ?? false;
  }

  wasKeyPressed(key: string): boolean {
    return this.keyStates.get(key.toLowerCase())?.wasPressed ?? false;
  }

  reset(): void {
    this.moveVector.set({ x: 0, y: 0 });
    this.lookVector.set({ x: 0, y: 0 });
    this.action.set(false);
    this.jump.set(false);
    this.actionBuffered.set(false);
    this.jumpBuffered.set(false);
    this.isUsingJoypad.set(false);
    this.isDragging.set(false);
    this.keyStates.clear();
    this.kalman.reset();
    this.lastCursorTime = 0;
    this.jumpBufferTimer = 0;
    this.actionBufferTimer = 0;
  }

  private validateCursorPosition(x: number, y: number): boolean {
    return Number.isFinite(x) && Number.isFinite(y) && 
           Math.abs(x) < 1e6 && Math.abs(y) < 1e6;
  }
}
