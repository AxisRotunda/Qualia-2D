import { Injectable, signal, computed } from '@angular/core';

export type EngineMode = 'edit' | 'play';
export type ActivePanel = 'none' | 'hierarchy' | 'inspector' | 'settings';
export type ControllerTopology = 'platformer' | 'top-down-rpg' | 'top-down-action';

@Injectable({ providedIn: 'root' })
export class EngineState2DService {
  // Simulation
  readonly mode = signal<EngineMode>('edit');
  readonly topology = signal<ControllerTopology>('platformer');
  readonly isPaused = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly fps = signal<number>(0);
  readonly physicsTimeMs = signal<number>(0);

  // Input State (Keyboard & Mouse)
  readonly keys = signal<Set<string>>(new Set());
  readonly cursorWorldX = signal<number>(0);
  readonly cursorWorldY = signal<number>(0);

  // Viewport
  readonly cameraX = signal<number>(0);
  readonly cameraY = signal<number>(0);
  readonly cameraZoom = signal<number>(50); 
  readonly gridVisible = signal<boolean>(true);
  readonly debugPhysics = signal<boolean>(false);
  readonly bgColor = signal<string>('#0f172a');

  // Interaction
  readonly isDragging = signal<boolean>(false);
  readonly dragTargetPos = signal<{x: number, y: number} | null>(null);

  // Physics Global
  readonly gravityY = signal<number>(-9.81);

  // UI Panels
  readonly activePanel = signal<ActivePanel>('none');
  readonly selectedEntityId = signal<number | null>(null);

  // Computed
  readonly statusText = computed(() => {
    if (this.loading()) return 'LOADING';
    const top = this.topology().replace(/-/g, ' ').toUpperCase();
    return `${this.mode().toUpperCase()} [${top}]`;
  });

  setFps(val: number) { this.fps.set(val); }
  setPhysicsTime(val: number) { this.physicsTimeMs.set(val); }
  
  toggleMode() { 
    this.mode.update(m => m === 'edit' ? 'play' : 'edit'); 
    if (this.mode() === 'play') this.activePanel.set('none');
  }

  setTopology(top: ControllerTopology) {
    this.topology.set(top);
  }
  
  togglePause() { this.isPaused.update(p => !p); }
  setLoading(l: boolean) { this.loading.set(l); }
  
  setActivePanel(panel: ActivePanel) {
    this.activePanel.update(current => current === panel ? 'none' : panel);
  }

  toggleGrid() {
    this.gridVisible.update(v => !v);
  }

  toggleDebugPhysics() {
    this.debugPhysics.update(v => !v);
  }

  updateGravity(val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      this.gravityY.set(num);
    }
  }

  updateCursor(x: number, y: number) {
    this.cursorWorldX.set(x);
    this.cursorWorldY.set(y);
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