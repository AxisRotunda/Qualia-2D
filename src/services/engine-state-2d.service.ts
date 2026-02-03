import { Injectable, signal, computed } from '@angular/core';

export type EngineMode = 'edit' | 'play';
export type ActivePanel = 'none' | 'hierarchy' | 'inspector' | 'settings';
export type ActiveOverlay = 'none' | 'scene-browser' | 'create-menu' | 'main-menu';
export type ControllerTopology = 'platformer' | 'top-down-rpg' | 'top-down-action';

@Injectable({ providedIn: 'root' })
export class EngineState2DService {
  // Simulation Context
  readonly mode = signal<EngineMode>('edit');
  readonly topology = signal<ControllerTopology>('platformer');
  readonly isPaused = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  
  // Telemetry
  readonly fps = signal<number>(0);
  readonly physicsTimeMs = signal<number>(0);

  // Simulation Globals
  readonly gravityY = signal<number>(-9.81);
  readonly bgColor = signal<string>('#020617');
  readonly gridVisible = signal<boolean>(true);
  readonly debugPhysics = signal<boolean>(false);

  // UI / Interaction Session
  readonly activePanel = signal<ActivePanel>('none');
  readonly activeOverlay = signal<ActiveOverlay>('main-menu');
  readonly selectedEntityId = signal<number | null>(null);

  // Derived: Global block for input / viewport
  readonly isOverlayOpen = computed(() => {
    return this.activeOverlay() !== 'none' || this.loading();
  });

  // Legacy compatibility for components using specific overlay signals
  readonly isMainMenuOpen = computed(() => this.activeOverlay() === 'main-menu');
  readonly isSceneBrowserOpen = computed(() => this.activeOverlay() === 'scene-browser');
  readonly isCreateMenuOpen = computed(() => this.activeOverlay() === 'create-menu');

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

  setOverlay(overlay: ActiveOverlay) {
    this.activeOverlay.set(overlay);
  }

  toggleGrid() { this.gridVisible.update(v => !v); }
  toggleDebugPhysics() { this.debugPhysics.update(v => !v); }

  updateGravity(val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) this.gravityY.set(num);
  }
}
