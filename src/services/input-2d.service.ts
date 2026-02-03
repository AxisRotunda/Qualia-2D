
import { Injectable, signal } from '@angular/core';

export interface Vector2 { x: number; y: number; }
export type InteractionDevice = 'mouse' | 'touch';

@Injectable({ providedIn: 'root' })
export class Input2DService {
  // Raw State
  readonly keys = signal<Set<string>>(new Set());
  readonly cursorWorld = signal<Vector2>({ x: 0, y: 0 });
  
  // Device Context
  readonly interactionDevice = signal<InteractionDevice>('mouse');
  
  // Normalized Vectors (Industry Standard)
  readonly moveVector = signal<Vector2>({ x: 0, y: 0 });
  readonly lookVector = signal<Vector2>({ x: 0, y: 0 });
  readonly isUsingJoypad = signal<boolean>(false);

  // Interaction State
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<Vector2 | null>(null);

  updateKeys(key: string, isDown: boolean) {
    this.keys.update(s => {
      const next = new Set(s);
      if (isDown) next.add(key.toLowerCase());
      else next.delete(key.toLowerCase());
      return next;
    });
  }

  setCursor(x: number, y: number) {
    this.cursorWorld.set({ x, y });
  }

  setDragging(active: boolean, pos?: Vector2) {
    this.isDragging.set(active);
    if (pos) this.dragTargetPos.set(pos);
    else if (!active) this.dragTargetPos.set(null);
  }

  reset() {
    this.keys.set(new Set());
    this.moveVector.set({ x: 0, y: 0 });
    this.lookVector.set({ x: 0, y: 0 });
    this.isUsingJoypad.set(false);
    this.isDragging.set(false);
    this.dragTargetPos.set(null);
  }
}
