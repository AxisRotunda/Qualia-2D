
import { Injectable, signal, computed } from '@angular/core';

export type EngineMode = 'edit' | 'play';

@Injectable({ providedIn: 'root' })
export class EngineState2DService {
  // Simulation
  readonly mode = signal<EngineMode>('edit');
  readonly isPaused = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly fps = signal<number>(0);
  readonly physicsTimeMs = signal<number>(0);

  // Viewport
  readonly cameraX = signal<number>(0);
  readonly cameraY = signal<number>(0);
  readonly cameraZoom = signal<number>(50); // Pixels per meter approximation
  readonly gridVisible = signal<boolean>(true);

  // Interaction
  readonly selectedEntityId = signal<number | null>(null);
  readonly showInspector = signal<boolean>(false);

  // Computed
  readonly statusText = computed(() => {
    if (this.loading()) return 'LOADING';
    return `${this.mode().toUpperCase()} | ${this.isPaused() ? 'PAUSED' : 'RUNNING'}`;
  });

  setFps(val: number) { this.fps.set(val); }
  setPhysicsTime(val: number) { this.physicsTimeMs.set(val); }
  toggleMode() { this.mode.update(m => m === 'edit' ? 'play' : 'edit'); }
  togglePause() { this.isPaused.update(p => !p); }
  setLoading(l: boolean) { this.loading.set(l); }
  toggleInspector() { this.showInspector.update(v => !v); }
  
  // Camera Ops
  panCamera(dx: number, dy: number) {
    this.cameraX.update(x => x + dx);
    this.cameraY.update(y => y + dy);
  }
  
  zoomCamera(delta: number) {
    this.cameraZoom.update(z => Math.max(10, Math.min(200, z + delta)));
  }
}
