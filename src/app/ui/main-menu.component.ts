import { Component, inject, signal } from '@angular/core';
import { EngineState2DService, ControllerTopology } from '../../services/engine-state-2d.service';
import { Engine2DService } from '../../services/engine-2d.service';
import { DocumentationService, VisualArticle } from '../../services/documentation.service';
import { StorageService } from '../../services/storage.service';
import { ProjectService } from '../../services/project.service';
import { SCENES } from '../../data/scene-presets';
import { DecimalPipe } from '@angular/common';
import { MenuPlayTabComponent } from './main-menu/play-tab.component';
import { MenuGuideTabComponent } from './main-menu/guide-tab.component';
import { MenuSettingsTabComponent } from './main-menu/settings-tab.component';
import { MenuLaunchModalComponent } from './main-menu/launch-modal.component';
import { MenuProjectsTabComponent } from './main-menu/projects-tab.component';

type MenuTab = 'projects' | 'play' | 'guide' | 'settings';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    DecimalPipe, 
    MenuPlayTabComponent, 
    MenuProjectsTabComponent, 
    MenuGuideTabComponent, 
    MenuSettingsTabComponent,
    MenuLaunchModalComponent
  ],
  template: `
    <div class="fixed inset-0 z-[90] bg-[#020617] text-slate-200 font-sans select-none overflow-hidden flex flex-col md:flex-row">
      
      <!-- ATMOSPHERE LAYER -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div class="absolute -top-[20%] -left-[10%] w-[1000px] h-[1000px] bg-indigo-950/20 blur-[150px] rounded-full mix-blend-screen opacity-60"></div>
        <div class="absolute bottom-[10%] right-[10%] w-[800px] h-[800px] bg-slate-800/10 blur-[120px] rounded-full mix-blend-overlay"></div>
      </div>

      <!-- SIDEBAR DOCK (Desktop: Left, Mobile: Bottom) -->
      <nav class="relative z-50 order-2 md:order-1 w-full md:w-24 md:h-full bg-slate-950/80 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-white/5 flex md:flex-col items-center justify-between py-4 md:py-8 px-6 md:px-0 shadow-2xl">
        
        <!-- Brand / Logo -->
        <div class="hidden md:flex flex-col items-center gap-4">
           <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]">Q2D</div>
        </div>

        <!-- Navigation Pills -->
        <div class="flex md:flex-col items-center justify-between md:justify-center w-full md:w-auto gap-1 md:gap-6">
          @for (tab of tabs; track tab.id) {
            <button (click)="activeTab.set(tab.id)" 
              class="group relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
              [class.bg-white/10]="activeTab() === tab.id"
              [class.text-white]="activeTab() === tab.id"
              [class.text-slate-500]="activeTab() !== tab.id"
              [class.hover:bg-white/5]="activeTab() !== tab.id">
              
              <!-- Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:scale-110 group-active:scale-95">
                <path [attr.d]="tab.icon"></path>
              </svg>

              <!-- Active Indicator (Desktop: Left Border, Mobile: Bottom Dot) -->
              @if (activeTab() === tab.id) {
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full hidden md:block shadow-[0_0_12px_#6366f1]"></div>
                <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full md:hidden"></div>
              }

              <!-- Tooltip (Desktop Only) -->
              <div class="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 hidden md:block">
                <span class="text-[9px] font-black uppercase tracking-widest text-white">{{ tab.label }}</span>
              </div>
            </button>
          }
        </div>

        <!-- System Status -->
        <div class="hidden md:flex flex-col items-center gap-3">
           <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span class="text-[8px] font-mono font-bold text-slate-600 rotate-180" style="writing-mode: vertical-rl;">v1.9.0</span>
        </div>
      </nav>

      <!-- MAIN CONTENT VIEWPORT -->
      <main class="relative z-10 order-1 md:order-2 flex-1 h-full overflow-hidden bg-gradient-to-br from-transparent to-slate-950/50">
         @switch (activeTab()) {
           @case ('projects') {
             <app-menu-projects-tab (openSceneBrowser)="activeTab.set('play')" />
           }
           @case ('play') {
             <app-menu-play-tab (select)="selectedScene.set($event)" (back)="activeTab.set('projects')" />
           }
           @case ('guide') {
             <app-menu-guide-tab (launch)="launchModuleSim($event)" />
           }
           @case ('settings') {
             <app-menu-settings-tab (toggleGrid)="toggleGrid()" (toggleDebug)="toggleDebug()" (clearStorage)="clearStorage()" />
           }
         }
      </main>

      <!-- LAUNCH MODAL (Global Overlay) -->
      @if (selectedScene(); as scene) {
        <app-menu-launch-modal 
          [scene]="scene" 
          (launch)="launch(scene, $event)" 
          (cancel)="selectedScene.set(null)" />
      }
    </div>
  `
})
export class MainMenuComponent {
  state = inject(EngineState2DService);
  engine = inject(Engine2DService);
  docs = inject(DocumentationService);
  storage = inject(StorageService);
  project = inject(ProjectService);

  readonly tabs: { id: MenuTab, label: string, icon: string }[] = [
    { id: 'projects', label: 'Projects', icon: 'M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z M3 9V5a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v2' },
    { id: 'play', label: 'Scenes', icon: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M9 12l6-4-6-4v8z' },
    { id: 'guide', label: 'Guides', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'settings', label: 'Config', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
  ];

  readonly activeTab = signal<MenuTab>('projects');
  readonly selectedScene = signal<any>(null);

  constructor() {
    if (this.storage.load('grid_hidden', false)) this.state.gridVisible.set(false);
    if (this.storage.load('debug_active', false)) this.state.debugPhysics.set(true);
  }

  launch(scene: any, topology: ControllerTopology) {
    this.engine.loadScene(scene);
    this.state.setTopology(topology);
    this.state.setOverlay('none');
    this.state.mode.set('play');
    this.selectedScene.set(null);
  }

  launchModuleSim(module: VisualArticle) {
    if (module.simulationSceneId) {
      const scene = SCENES.find(s => s.id === module.simulationSceneId);
      if (scene) this.selectedScene.set(scene);
    }
  }

  toggleGrid() {
    this.state.toggleGrid();
    this.storage.save('grid_hidden', !this.state.gridVisible());
  }

  toggleDebug() {
    this.state.toggleDebugPhysics();
    this.storage.save('debug_active', this.state.debugPhysics());
  }

  clearStorage() {
    this.storage.clear();
    window.location.reload();
  }
}