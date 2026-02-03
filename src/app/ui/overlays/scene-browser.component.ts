
import { Component, inject, output } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { SCENES } from '../../../data/scene-presets';

@Component({
  selector: 'app-scene-browser-overlay',
  standalone: true,
  template: `
    <div (click)="close.emit()" class="absolute inset-0 z-80 flex items-center justify-center p-4 md:p-12 bg-slate-950/70 backdrop-blur-2xl animate-in fade-in duration-300 pointer-events-auto touch-none">
      <div (click)="$event.stopPropagation()" class="w-full max-w-4xl max-h-[85vh] bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-6 md:p-12 flex flex-col space-y-6 md:space-y-10 animate-in zoom-in-95 duration-500 overflow-hidden">
        <header class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter leading-none">Planar Fragments</h3>
            <p class="text-indigo-500/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Select Simulation Context</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 rounded-full text-slate-400 active:scale-90 transition-all hover:bg-white/10 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 pr-2 custom-scrollbar touch-pan-y overscroll-contain">
          @for (scene of scenes; track scene.id) {
            @let isActive = engine.sceneManager.currentScene()?.id === scene.id;
            <button (click)="select.emit(scene.id); $event.stopPropagation()" 
              class="group relative flex flex-col text-left p-5 md:p-8 rounded-[2rem] border transition-all active:scale-[0.97] outline-none pointer-events-auto"
              [class.bg-indigo-600]="isActive"
              [class.border-indigo-400/50]="isActive"
              [class.bg-white/5]="!isActive"
              [class.border-white/5]="!isActive"
              [class.hover:bg-white/10]="!isActive"
              [class.hover:border-white/10]="!isActive">
              
              <div class="flex items-center justify-between mb-3 md:mb-5">
                <div class="px-2.5 py-1 bg-black/20 rounded-lg border border-white/5 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:text-white transition-colors">
                  {{ scene.complexity }}
                </div>
                <div class="flex gap-1.5">
                  @for (tag of scene.tags; track tag) {
                    <span class="text-[6px] md:text-[7px] text-slate-500 uppercase font-black tracking-widest">{{ tag }}</span>
                  }
                </div>
              </div>

              <h4 class="text-white font-black text-lg md:text-2xl mb-1 md:mb-2 group-hover:translate-x-1 transition-transform">{{ scene.name }}</h4>
              <p class="text-slate-400 text-[10px] md:text-xs leading-relaxed line-clamp-2">{{ scene.description }}</p>

              @if (isActive) {
                <div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse"></div>
              }
            </button>
          }
        </div>

        <footer class="pt-4 border-t border-white/5 flex items-center justify-between">
          <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active Core: {{ engine.sceneManager.currentScene()?.id || 'null' }}</span>
          <div class="flex gap-2">
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-pulse"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 2px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class SceneBrowserOverlayComponent {
  engine = inject(Engine2DService);
  scenes = SCENES;
  select = output<string>();
  close = output<void>();
}
