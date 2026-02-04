import { Component, inject, output } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { ProjectService } from '../../../services/project.service';
import { SCENES } from '../../../data/scene-presets';
import { ScenePreset2D } from '../../../engine/scene.types';

@Component({
  selector: 'app-menu-play-tab',
  standalone: true,
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <div class="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
        
        <!-- Context Header -->
        <header class="flex items-start justify-between border-b border-white/5 pb-8">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-indigo-400">
               <span class="text-[9px] font-black uppercase tracking-widest">Active Context</span>
               <div class="h-px w-8 bg-indigo-500/20"></div>
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {{ project.activeProject()?.name || 'Unknown Project' }}
            </h2>
            <p class="text-slate-500 text-sm font-medium">Select a fragment to initialize simulation.</p>
          </div>
          
          <button (click)="back.emit()" class="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            Change Project
          </button>
        </header>

        <!-- Scene Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          @for (scene of scenes; track scene.id) {
            <button (click)="select.emit(scene)" 
              class="group relative h-48 md:h-64 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md text-left transition-all active:scale-[0.98] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-xl">
              
              <!-- Background Ambient -->
              <div class="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent z-0"></div>
              <div class="absolute top-0 right-0 p-40 bg-indigo-600/5 blur-[80px] rounded-full group-hover:bg-indigo-500/15 transition-all duration-700"></div>

              <!-- Top Row: Tags -->
              <div class="relative z-10 flex items-center justify-between">
                <div class="flex gap-2">
                  <div class="px-2.5 py-1 bg-black/40 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-indigo-400">
                    {{ scene.complexity }}
                  </div>
                  <!-- Derived Config Tags -->
                  @if (scene.config?.env?.type; as type) {
                    <div class="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                      {{ type === 'atmosphere' ? 'ATMOS' : 'SOLID' }}
                    </div>
                  }
                </div>
              </div>

              <!-- Center: Title -->
              <div class="relative z-10 pl-2 border-l-2 border-white/10 group-hover:border-indigo-500 transition-colors">
                <h3 class="text-3xl font-black text-white mb-2 leading-none tracking-tight">{{ scene.name }}</h3>
                <p class="text-xs text-slate-400 font-medium leading-relaxed max-w-md line-clamp-2">{{ scene.description }}</p>
              </div>

              <!-- Bottom: Action -->
              <div class="relative z-10 flex items-center justify-end">
                <div class="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span class="text-[9px] font-black uppercase tracking-widest text-white">Load Fragment</span>
                  <div class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
  `]
})
export class MenuPlayTabComponent {
  project = inject(ProjectService);
  engine = inject(Engine2DService);
  scenes = SCENES;
  
  select = output<ScenePreset2D>();
  back = output<void>();
}