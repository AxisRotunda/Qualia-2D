import { Component, inject, signal } from '@angular/core';
import { EngineState2DService, ControllerTopology } from '../../../services/engine-state-2d.service';
import { Engine2DService } from '../../../services/engine-2d.service';
import { DocumentationService, VisualArticle } from '../../../services/documentation.service';
import { StorageService } from '../../../services/storage.service';
import { ProjectService } from '../../../services/project.service';
import { SCENES } from '../../../data/scene-presets';
import { DecimalPipe } from '@angular/common';
import { MenuPlayTabComponent } from './play-tab.component';
import { MenuGuideTabComponent } from './guide-tab.component';
import { MenuSettingsTabComponent } from './settings-tab.component';
import { MenuLaunchModalComponent } from './launch-modal.component';
import { MenuProjectsTabComponent } from './projects-tab.component';

// Main Menu Configuration
const MENU_CONFIG = {
  VERSION: 'v1.9.0',
  STATUS: 'Ready',
  STORAGE_KEYS: {
    GRID_HIDDEN: 'grid_hidden',
    DEBUG_ACTIVE: 'debug_active',
  },
  DEFAULT_TAB: 'projects' as MenuTab,
} as const;

type MenuTab = 'projects' | 'play' | 'guide' | 'settings';

/**
 * Main Menu Navigation Configuration
 */
const MENU_TABS = [
  {
    id: 'projects' as const,
    label: 'Workspaces',
    icon: 'M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z M3 9V5a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v2',
  },
  {
    id: 'play' as const,
    label: 'Scenes',
    icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  },
  {
    id: 'guide' as const,
    label: 'Learn',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    id: 'settings' as const,
    label: 'Setup',
    icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  },
] as const;

/**
 * Main Menu Component V2.0
 * Central navigation hub for workspace, scene, and configuration management.
 * Features:
 * - Project/workspace switching
 * - Scene browser and launcher
 * - Learning module integration
 * - System configuration
 */
@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    DecimalPipe,
    MenuPlayTabComponent,
    MenuGuideTabComponent,
    MenuSettingsTabComponent,
    MenuLaunchModalComponent,
    MenuProjectsTabComponent
  ],
  template: `
    <div class="fixed inset-0 z-[90] bg-[#020617] text-slate-200 font-sans select-none overflow-hidden">
      
      <!-- BACKGROUND ATMOSPHERE -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-[20%] left-1/4 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10s]"></div>
        <div class="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[8s]"></div>
      </div>

      <!-- MAIN CONTENT LAYER -->
      <main class="absolute inset-0 z-0">
         @switch (activeTab()) {
           @case ('projects') {
             <app-menu-projects-tab (openSceneBrowser)="navigateToSceneBrowser()" />
           }
           @case ('play') {
             <app-menu-play-tab (select)="selectScene($event)" (back)="navigateToProjects()" />
           }
           @case ('guide') {
             <app-menu-guide-tab (launch)="launchModuleSim($event)" />
           }
           @case ('settings') {
             <app-menu-settings-tab (toggleGrid)="toggleGrid()" (toggleDebug)="toggleDebug()" (clearStorage)="clearStorage()" />
           }
         }
      </main>

      <!-- FLOATING NAVIGATION HEADER -->
      <header class="absolute top-0 inset-x-0 z-50 flex flex-col items-center pt-8 pb-12 pointer-events-none bg-gradient-to-b from-[#020617] via-[#020617]/80 to-transparent">
        <div class="flex flex-col items-center gap-1 mb-6 animate-in slide-in-from-top-4 duration-700">
          <div class="flex items-center gap-3">
             <div class="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-[0_0_20px_rgba(99,102,241,0.5)]">Q</div>
             <h1 class="text-xl font-black tracking-tighter text-white drop-shadow-2xl uppercase">Qualia_2D</h1>
          </div>
          <div class="text-[7px] text-indigo-500/50 uppercase font-black tracking-[0.5em]">{{ projectName() }}</div>
        </div>

        <nav class="pointer-events-auto flex items-center gap-1 p-1.5 bg-slate-950/40 backdrop-blur-3xl rounded-full border border-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500 delay-100" role="navigation" aria-label="Main menu">
          @for (tab of tabs; track tab.id) {
            <button (click)="activeTab.set(tab.id)" 
              class="relative px-6 py-3 rounded-full flex items-center gap-3 transition-all active:scale-95 group overflow-hidden"
              [class.bg-white/5]="activeTab() === tab.id"
              [class.text-white]="activeTab() === tab.id"
              [class.text-slate-500]="activeTab() !== tab.id"
              [class.hover:text-slate-300]="activeTab() !== tab.id"
              [attr.aria-current]="activeTab() === tab.id ? 'page' : null"
              [attr.aria-label]="'Navigate to ' + tab.label">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10 transition-transform group-hover:scale-110">
                <path [attr.d]="tab.icon"></path>
              </svg>
              <span class="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] hidden sm:inline">{{ tab.label }}</span>
              
              @if (activeTab() === tab.id) {
                <div class="absolute inset-x-4 bottom-0 h-px bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
              }
            </button>
          }
        </nav>
      </header>

      <!-- LAUNCH MODAL -->
      @if (selectedScene(); as scene) {
        <app-menu-launch-modal 
          [scene]="scene" 
          (launch)="launchScene(scene, $event)" 
          (cancel)="deselectScene()" />
      }

      <!-- FOOTER STATUS -->
      <footer class="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-10 animate-in slide-in-from-bottom-4 duration-1000">
         <div class="flex items-center gap-8 px-8 py-3 bg-slate-950/40 backdrop-blur-md rounded-full border border-white/5">
            <div class="flex items-center gap-3">
               <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <span class="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Core Stable</span>
            </div>
            <div class="h-4 w-px bg-white/10"></div>
            <div class="flex gap-4">
              <span class="text-[9px] font-mono text-slate-600 font-bold uppercase">{{ version }}</span>
              <span class="text-[9px] font-mono text-slate-600 font-bold uppercase">{{ status }}</span>
            </div>
         </div>
      </footer>
    </div>
  `
})
export class MainMenuComponent {
  private readonly state = inject(EngineState2DService);
  private readonly engine = inject(Engine2DService);
  private readonly docs = inject(DocumentationService);
  private readonly storage = inject(StorageService);
  protected readonly project = inject(ProjectService);

  // Configuration
  protected readonly tabs = MENU_TABS;
  protected readonly version = MENU_CONFIG.VERSION;
  protected readonly status = MENU_CONFIG.STATUS;

  // State
  readonly activeTab = signal<MenuTab>(MENU_CONFIG.DEFAULT_TAB);
  readonly selectedScene = signal<any>(null);

  // Computed
  protected readonly projectName = () => 
    this.project.activeProject()?.name || 'Initializing Session';

  constructor() {
    this.initializeSettings();
  }

  /**
   * Loads persisted settings from storage
   */
  private initializeSettings(): void {
    const { GRID_HIDDEN, DEBUG_ACTIVE } = MENU_CONFIG.STORAGE_KEYS;
    
    if (this.storage.load(GRID_HIDDEN, false)) {
      this.state.gridVisible.set(false);
    }
    
    if (this.storage.load(DEBUG_ACTIVE, false)) {
      this.state.debugPhysics.set(true);
    }
  }

  /**
   * Launches a scene with specified topology
   */
  protected launchScene(scene: any, topology: ControllerTopology): void {
    this.engine.loadScene(scene);
    this.state.setTopology(topology);
    this.state.setOverlay('none');
    this.state.mode.set('play');
    this.deselectScene();
  }

  /**
   * Opens scene selection modal
   */
  protected selectScene(scene: any): void {
    this.selectedScene.set(scene);
  }

  /**
   * Closes scene selection modal
   */
  protected deselectScene(): void {
    this.selectedScene.set(null);
  }

  /**
   * Launches learning module simulation
   */
  protected launchModuleSim(module: VisualArticle): void {
    if (!module.simulationSceneId) return;
    
    const scene = SCENES.find(s => s.id === module.simulationSceneId);
    if (scene) {
      this.selectScene(scene);
    }
  }

  /**
   * Navigation helpers
   */
  protected navigateToProjects(): void {
    this.activeTab.set('projects');
  }

  protected navigateToSceneBrowser(): void {
    this.activeTab.set('play');
  }

  /**
   * Settings toggles with persistence
   */
  protected toggleGrid(): void {
    this.state.toggleGrid();
    this.storage.save(MENU_CONFIG.STORAGE_KEYS.GRID_HIDDEN, !this.state.gridVisible());
  }

  protected toggleDebug(): void {
    this.state.toggleDebugPhysics();
    this.storage.save(MENU_CONFIG.STORAGE_KEYS.DEBUG_ACTIVE, this.state.debugPhysics());
  }

  protected clearStorage(): void {
    this.storage.clear();
    window.location.reload();
  }
}
