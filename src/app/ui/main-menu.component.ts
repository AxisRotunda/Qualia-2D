
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
    <div class="fixed inset-0 z-[90] flex flex-col md:flex-row bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      <!-- NAVIGATION SIDEBAR -->
      <nav class="w-full md:w-80 flex-none border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-slate-950/40 backdrop-blur-3xl relative z-10">
        <div class="p-8 flex flex-col h-full">
           <div class="mb-12">
              <h1 class="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">Q</div>
                QUALIA_2D
              </h1>
              <div class="text-[9px] text-indigo-500 uppercase font-black tracking-[0.4em] mt-2 opacity-60">Engine Protocol 1.4</div>
           </div>

           <div class="flex-1 space-y-2">
              @for (tab of tabs; track tab.id) {
                <button (click)="activeTab.set(tab.id)" 
                  class="w-full text-left p-5 rounded-3xl transition-all group relative overflow-hidden flex items-center justify-between border"
                  [class.bg-white/5]="activeTab() !== tab.id"
                  [class.border-white/5]="activeTab() !== tab.id"
                  [class.bg-indigo-600/10]="activeTab() === tab.id"
                  [class.border-indigo-500/30]="activeTab() === tab.id"
                  [class.text-white]="activeTab() === tab.id"
                  [class.text-slate-400]="activeTab() !== tab.id">
                  
                  <div class="flex items-center gap-4 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
                      [class.text-indigo-400]="activeTab() === tab.id">
                      <path [attr.d]="tab.icon"></path>
                    </svg>
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">{{ tab.label }}</span>
                  </div>

                  @if (activeTab() === tab.id) {
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  }
                </button>
              }
           </div>

           <div class="pt-8 border-t border-white/5">
              <div class="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4">
                 <span>Core Status</span>
                 <span class="text-emerald-500">Live</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                 <div class="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div class="text-[7px] text-slate-500 uppercase font-black mb-1">Nodes</div>
                    <div class="text-xs font-mono font-bold text-white">{{ engine.ecs.entityCount() }}</div>
                 </div>
                 <div class="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div class="text-[7px] text-slate-500 uppercase font-black mb-1">Latency</div>
                    <div class="text-xs font-mono font-bold text-white">{{ (1000/state.fps()) | number:'1.1-1' }}ms</div>
                 </div>
              </div>
           </div>
        </div>
      </nav>

      <!-- MAIN CONTENT VIEWPORT -->
      <main class="flex-1 relative overflow-hidden bg-slate-900/20">
         <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5 pointer-events-none"></div>

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

         <!-- LAUNCH MODAL -->
         @if (selectedScene(); as scene) {
            <div (click)="selectedScene.set(null)" class="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
               <div (click)="$event.stopPropagation()" class="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[4rem] p-12 md:p-16 animate-in zoom-in-95 duration-500 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)]">
                  <header class="flex items-start justify-between mb-12">
                     <div class="space-y-2">
                        <div class="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em]">Ready for Injection</div>
                        <h2 class="text-5xl font-black text-white leading-none tracking-tighter">{{ scene.name }}</h2>
                     </div>
                     <button (click)="selectedScene.set(null)" class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
                     </button>
                  </header>
                  <div class="space-y-10">
                     <div class="space-y-4">
                        <label class="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] px-2">Topology_Override</label>
                        <div class="grid grid-cols-3 gap-4">
                           @for (t of topologies; track t) {
                              <button (click)="selectedTopology.set(t)" 
                                 class="p-6 rounded-3xl border text-center transition-all relative overflow-hidden"
                                 [class.bg-indigo-600]="selectedTopology() === t"
                                 [class.border-indigo-400]="selectedTopology() === t"
                                 [class.bg-white/5]="selectedTopology() !== t"
                                 [class.border-white/5]="selectedTopology() !== t">
                                 <div class="text-[11px] font-black uppercase tracking-widest text-white">{{ t.replace('-', ' ') }}</div>
                              </button>
                           }
                        </div>
                     </div>
                     <button (click)="launch()" class="w-full py-7 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]">
                        Initialize Reality Stream
                     </button>
                  </div>
               </div>
            </div>
         }
      </main>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MainMenuComponent {
  state = inject(EngineState2DService);
  engine = inject(Engine2DService);
  docs = inject(DocumentationService);
  storage = inject(StorageService);

  readonly tabs = [
    { id: 'play', label: 'Reality Fragments', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
    { id: 'guide', label: 'Human Translations', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'settings', label: 'Engine Config', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
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
