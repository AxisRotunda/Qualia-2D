
import { Component, inject } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { ProjectService } from '../../../services/project.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-scene-inspector',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @if (engine.sceneManager.currentScene(); as scene) {
      <div class="space-y-6 animate-in slide-in-from-right-4 duration-500">
        
        <!-- SCENE PRIMARY -->
        <div class="bg-indigo-600/10 p-6 rounded-[2.5rem] border border-indigo-500/20 space-y-4 shadow-xl">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                S
              </div>
              <div class="flex flex-col">
                <span class="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Active World</span>
                <span class="text-white font-black tracking-tighter uppercase">{{ scene.name }}</span>
              </div>
           </div>
           
           <div class="space-y-1">
             <label class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Scene Alias</label>
             <input type="text" [value]="scene.name" (input)="scene.name = $any($event.target).value"
               class="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold tracking-tight outline-none focus:border-indigo-500/40 text-slate-200 transition-all">
           </div>
        </div>

        <!-- KINETIC TOPOLOGY (New V2.0 Standard) -->
        <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-400"><path d="M2 12h20M2 12l5-5m-5 5 5 5"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">Kinetic Topology</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Input & Physics Laws</span>
                 </div>
               </div>
            </div>
            <div class="p-6 space-y-3">
               <div class="flex flex-col gap-2">
                 @for (topo of topologies; track topo) {
                   <button (click)="state.setTopology(topo)" 
                     class="w-full p-4 rounded-2xl border text-left transition-all active:scale-95 flex items-center justify-between group"
                     [class.bg-emerald-600]="state.topology() === topo"
                     [class.border-emerald-400/30]="state.topology() === topo"
                     [class.border-white/5]="state.topology() !== topo"
                     [class.hover:bg-white/5]="state.topology() !== topo">
                     
                     <div class="flex flex-col">
                       <span class="text-[9px] font-black uppercase tracking-widest"
                         [class.text-white]="state.topology() === topo"
                         [class.text-slate-400]="state.topology() !== topo">
                         {{ topo.replace('-', ' ') }}
                       </span>
                     </div>
                     
                     @if (state.topology() === topo) {
                       <div class="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                     }
                   </button>
                 }
               </div>
               <p class="text-[8px] text-slate-500 text-center pt-2">Warning: Changing topology alters global gravity and controller mappings.</p>
            </div>
        </div>

        <!-- ENVIRONMENT SETTINGS -->
        <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><path d="M12 2v20M2 12h20"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">Atmosphere</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Environmental Core</span>
                 </div>
               </div>
            </div>
            <div class="p-6 space-y-6">
               <!-- Background Color -->
               <div class="space-y-3">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Background Theme</span>
                  <div class="grid grid-cols-7 gap-2">
                    @for (c of ['#020617', '#0f172a', '#1e293b', '#334155', '#312e81', '#1e1b4b', '#000000']; track c) {
                      <button (click)="updateEnv('background', c)" 
                        class="w-full aspect-square rounded-full border-2 transition-all active:scale-75 shadow-lg"
                        [style.background-color]="c"
                        [class.border-white]="state.envConfig().background === c"
                        [class.border-transparent]="state.envConfig().background !== c">
                      </button>
                    }
                  </div>
               </div>

               <!-- Grid Opacity -->
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Coordinate Grid</span>
                    <span class="text-[10px] font-mono text-white">{{ state.envConfig().gridOpacity * 100 | number:'1.0-0' }}%</span>
                  </div>
                  <input type="range" min="0" max="0.5" step="0.01" [value]="state.envConfig().gridOpacity" (input)="updateEnv('gridOpacity', +$any($event.target).value)"
                    class="w-full accent-indigo-500">
               </div>
            </div>
        </div>

        <!-- PHYSICS CONFIG -->
        <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-400"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 3"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">World Physics</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Global Dynamics</span>
                 </div>
               </div>
            </div>
            <div class="p-6 space-y-6">
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Gravity Force</span>
                    <span class="text-[10px] font-mono text-white">{{ state.gravityY() | number:'1.1-1' }} <span class="text-[8px] ml-1 opacity-50">m/s²</span></span>
                  </div>
                  <input type="range" min="-20" max="20" step="0.1" [value]="state.gravityY()" (input)="state.updateGravity($any($event.target).value)"
                    class="w-full accent-amber-500">
               </div>
            </div>
        </div>

        <!-- PERSIST ACTION -->
        <button (click)="commitChanges(scene.id)" 
          class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Commit Scene Configuration
        </button>
      </div>
    }
  `,
  styles: [`
    .accent-indigo-500 { accent-color: #6366f1; }
    .accent-amber-500 { accent-color: #f59e0b; }
  `]
})
export class SceneInspectorComponent {
  public engine = inject(Engine2DService);
  public state = inject(EngineState2DService);
  public project = inject(ProjectService);

  topologies = ['platformer', 'top-down-rpg', 'top-down-action'];

  updateEnv(key: string, value: any) {
    this.state.envConfig.update(prev => ({ ...prev, [key]: value }));
  }

  commitChanges(sceneId: string) {
    const config = {
      env: this.state.envConfig(),
      physics: {
        gravity: { x: 0, y: this.state.gravityY() }
      },
      topology: this.state.topology()
    };
    this.project.saveSceneOverride(sceneId, config);
  }
}