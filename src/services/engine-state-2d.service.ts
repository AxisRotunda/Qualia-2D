
import { Injectable, signal, computed } from '@angular/core';

export type EngineMode = 'edit' | 'play';
export type ActivePanel = 'none' | 'hierarchy' | 'inspector' | 'settings';

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
  readonly cameraZoom = signal<number>(50); 
  readonly gridVisible = signal<boolean>(true);
  readonly bgColor = signal<string>('#0f172a');

  // Physics Global
  readonly gravityY = signal<number>(-9.81);

  // UI Panels
  readonly activePanel = signal<ActivePanel>('none');
  readonly selectedEntityId = signal<number | null>(null);

  // Computed
  readonly statusText = computed(() => {
    if (this.loading()) return 'LOADING';
    return `${this.mode().toUpperCase()} | ${this.isPaused() ? 'PAUSED' : 'RUNNING'}`;
  });

  setFps(val: number) { this.fps.set(val); }
  setPhysicsTime(val: number) { this.physicsTimeMs.set(val); }
  
  toggleMode() { 
    this.mode.update(m => m === 'edit' ? 'play' : 'edit'); 
    if (this.mode() === 'play') this.activePanel.set('none');
  }
  
  togglePause() { this.isPaused.update(p => !p); }
  setLoading(l: boolean) { this.loading.set(l); }
  
  setActivePanel(panel: ActivePanel) {
    this.activePanel.update(current => current === panel ? 'none' : panel);
  }

  // Template Helpers to avoid arrow functions in HTML
  toggleGrid() {
    this.gridVisible.update(v => !v);
  }

  updateGravity(val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      this.gravityY.set(num);
    }
  }

  // Camera Ops
  panCamera(dx: number, dy: number) {
    this.cameraX.update(x => x + dx);
    this.cameraY.update(y => y + dy);
  }
  
  zoomCamera(delta: number) {
    this.cameraZoom.update(z => Math.max(5, Math.min(500, z + delta)));
  }
}
