import { Component, inject, output } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { SCENES } from '../../../data/scene-presets';
import { ScenePreset2D } from '../../../engine/scene.types';

@Component({
  selector: 'app-menu-play-tab',
  standalone: true,
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto pt-36 pb-24 px-6 md:px-12 animate-in fade-in slide-in-from-right-8 duration-700">
        <header class="mb-16">
          <h2 class="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">Select_Scene</h2>
          <p class="text-indigo-500 text-xs font-black uppercase tracking-[0.5em]">Fragments of Simulated Reality</p>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          @for (scene of scenes; track scene.id) {
            <button (click)="select.emit(scene)" 
              class="group relative aspect-[16/9] md:aspect-auto md:h-80 p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md text-left transition-all active:scale-[0.98] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-2xl">
              <div class="absolute top-0 right-0 p-48 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700 group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="px-3 py-1 bg-black/40 rounded-full border border-white/5 text-[7px] font-black uppercase tracking-widest text-indigo-400">{{ scene.complexity }}</div>
                  <div class="flex gap-2">
                    @for (tag of scene.tags; track tag) {
                      <span class="text-[7px] text-slate-500 font-bold uppercase tracking-tighter">{{ tag }}</span>
                    }
                  </div>
                </div>
                <h3 class="text-3xl md:text-4xl font-black text-white mb-4 leading-none group-hover:translate-x-2 transition-transform duration-500">{{ scene.name }}</h3>
                <p class="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">{{ scene.description }}</p>
              </div>
              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-white"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-indigo-300 transition-colors">Initialize</span>
                </div>
              </div>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuPlayTabComponent {
  engine = inject(Engine2DService);
  scenes = SCENES;
  select = output<ScenePreset2D>();
}