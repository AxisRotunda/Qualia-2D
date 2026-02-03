import { Component, inject, signal } from '@angular/core';
import { EngineState2DService, ControllerTopology } from '../../services/engine-state-2d.service';
import { Engine2DService } from '../../services/engine-2d.service';
import { DocumentationService, VisualArticle } from '../../services/documentation.service';
import { StorageService } from '../../services/storage.service';
import { SCENES } from '../../data/scene-presets';
import { DecimalPipe } from '@angular/common';
import { MenuPlayTabComponent } from './main-menu/play-tab.component';
import { MenuGuideTabComponent } from './main-menu/guide-tab.component';
import { MenuSettingsTabComponent } from './main-menu/settings-tab.component';

type MenuTab = 'play' | 'guide' | 'settings';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [DecimalPipe, MenuPlayTabComponent, MenuGuideTabComponent, MenuSettingsTabComponent],
  template: `
    <div class="fixed inset-0 z-[90] bg-[#020617] text-slate-200 font-sans select-none">
      
      <!-- BACKGROUND ATMOSPHERE -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-[20%] left-1/4 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div class="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <!-- MAIN CONTENT LAYER (Z-0) -->
      <!-- Content scrolls BEHIND the header -->
      <main class="absolute inset-0 z-0">
         @switch (activeTab()) {
           @case ('play') {
             <app-menu-play-tab (select)="selectScene($event)" />
           }
           @case ('guide') {
             <app-menu-guide-tab (launch)="launchModuleSim($event)" />
           }
           @case ('settings') {
             <app-menu-settings-tab (toggleGrid)="toggleGrid()" (toggleDebug)="toggleDebug()" (clearStorage)="clearStorage()" />
           }
         }
      </main>

      <!-- FLOATING NAVIGATION HEADER (Z-50) -->
      <header class="absolute top-0 inset-x-0 z-50 flex flex-col items-center pt-6 pointer-events-none">
        
        <!-- Branding (Fades out on scroll could be added, but static is fine for now) -->
        <div class="flex flex-col items-center gap-1 mb-4 animate-in slide-in-from-top-4 duration-700">
          <h1 class="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center gap-3 drop-shadow-2xl">
            <div class="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] shadow-[0_0_15px_rgba(99,102,241,0.5)]">Q</div>
            QUALIA_2D
          </h1>
        </div>

        <!-- Glass Pill Nav -->
        <nav class="pointer-events-auto flex items-center gap-1 p-1.5 bg-slate-950/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 delay-100">
          @for (tab of tabs; track tab.id) {
            <button (click)="activeTab.set(tab.id)" 
              class="relative px-5 md:px-7 py-2.5 rounded-full flex items-center gap-3 transition-all active:scale-95 group overflow-hidden"
              [class.bg-white/10]="activeTab() === tab.id"
              [class.text-white]="activeTab() === tab.id"
              [class.text-slate-500]="activeTab() !== tab.id"
              [class.hover:text-slate-300]="activeTab() !== tab.id">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10">
                <path [attr.d]="tab.icon"></path>
              </svg>
              <span class="relative z-10 text-[10px] font-black uppercase tracking-widest hidden md:inline">{{ tab.label }}</span>
              
              <!-- Active Glow -->
              @if (activeTab() === tab.id) {
                <div class="absolute inset-0 bg-indigo-500/20 blur-md"></div>
              }
            </button>
          }
        </nav>
      </header>

      <!-- LAUNCH MODAL (Z-100) -->
      @if (selectedScene(); as scene) {
        <div (click)="selectedScene.set(null)" class="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div (click)="$event.stopPropagation()" class="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[3rem] p-8 md:p-12 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              
              <!-- Modal Decor -->
              <div class="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

              <header class="relative z-10 flex items-start justify-between mb-10">
                  <div class="space-y-2">
                    <div class="text-indigo-500 text-[9px] font-black uppercase tracking-[0.4em]">Target_Fragment</div>
                    <h2 class="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">{{ scene.name }}</h2>
                  </div>
                  <button (click)="selectedScene.set(null)" class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
                  </button>
              </header>

              <div class="relative z-10 space-y-8">
                  <div class="space-y-4">
                    <label class="text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] px-2">Control_Topology</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        @for (t of topologies; track t) {
                          <button (click)="selectedTopology.set(t)" 
                              class="p-4 rounded-2xl border text-center transition-all relative overflow-hidden active:scale-95"
                              [class.bg-indigo-600]="selectedTopology() === t"
                              [class.border-indigo-400]="selectedTopology() === t"
                              [class.bg-white/5]="selectedTopology() !== t"
                              [class.border-white/5]="selectedTopology() !== t">
                              <div class="text-[9px] font-black uppercase tracking-widest text-white">{{ t.replace('-', ' ') }}</div>
                          </button>
                        }
                    </div>
                  </div>

                  <button (click)="launch()" class="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
                    Initialize Reality Stream
                  </button>
              </div>
            </div>
        </div>
      }

      <!-- BOTTOM TELEMETRY (Z-10) -->
      <footer class="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-10">
         <div class="flex items-center gap-6 px-6 py-2 bg-slate-950/40 backdrop-blur-md rounded-full border border-white/5">
            <div class="flex items-center gap-2">
               <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span class="text-[9px] font-mono text-emerald-500/80 font-bold uppercase tracking-wider">System Live</span>
            </div>
            <div class="h-3 w-px bg-white/10"></div>
            <span class="text-[9px] font-mono text-slate-500 font-bold">VER 1.8.4</span>
         </div>
      </footer>
    </div>
  `
})
export class MainMenuComponent {
  state = inject(EngineState2DService);
  engine = inject(Engine2DService);
  docs = inject(DocumentationService);
  storage = inject(StorageService);

  readonly tabs = [
    { id: 'play', label: 'Play', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
    { id: 'guide', label: 'Guides', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'settings', label: 'Config', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
  ];

  readonly scenes = SCENES;
  readonly topologies: ControllerTopology[] = ['platformer', 'top-down-action', 'top-down-rpg'];

  readonly activeTab = signal<MenuTab>('play');
  readonly selectedScene = signal<any>(null);
  readonly selectedTopology = signal<ControllerTopology>('platformer');

  constructor() {
    if (this.storage.load('grid_hidden', false)) this.state.gridVisible.set(false);
    if (this.storage.load('debug_active', false)) this.state.debugPhysics.set(true);
  }

  selectScene(scene: any) {
    this.selectedScene.set(scene);
    if (scene.preferredTopology) {
      this.selectedTopology.set(scene.preferredTopology);
    }
  }

  launch() {
    const s = this.selectedScene();
    if (s) {
      this.engine.loadScene(s);
      this.state.setTopology(this.selectedTopology());
      this.state.isMainMenuOpen.set(false);
      this.state.mode.set('play');
    }
  }

  launchModuleSim(module: VisualArticle) {
    if (module.simulationSceneId) {
      const scene = this.scenes.find(s => s.id === module.simulationSceneId);
      if (scene) {
        this.selectScene(scene);
      }
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