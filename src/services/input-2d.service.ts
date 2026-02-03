
import { Injectable, signal } from '@angular/core';

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
 */
@Injectable({ providedIn: 'root' })
export class Input2DService {
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

  // Expose specific signals for high-frequency consumption
  readonly keys = signal<Set<string>>(new Set());
  readonly cursorWorld = signal<Vector2>({ x: 0, y: 0 });
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<Vector2 | null>(null);

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
  }

  /**
   * Sets the world-space cursor position.
   */
  setCursor(x: number, y: number) {
    this.cursorWorld.set({ x, y });
  }

  /**
   * Manages entity dragging state.
   */
  setDragging(active: boolean, pos?: Vector2) {
    this.isDragging.set(active);
    if (pos) {
      this.dragTargetPos.set(pos);
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
    this.isUsingJoypad.set(false);
    this.isDragging.set(false);
    this.dragTargetPos.set(null);
  }
}
