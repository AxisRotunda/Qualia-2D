import { Component, inject, output } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { SCENES } from '../../../data/scene-presets';

@Component({
  selector: 'app-scene-browser-overlay',
  standalone: true,
  template: `
    <div (click)="close.emit()" class="absolute inset-0 z-[80] flex items-center justify-center p-4 md:p-12 bg-slate-950/70 backdrop-blur-2xl animate-in fade-in duration-300 pointer-events-auto touch-none">
      <div (click)="$event.stopPropagation()" class="w-full max-w-4xl max-h-[85vh] bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-6 md:p-12 flex flex-col space-y-6 md:space-y-10 animate-in zoom-in-95 duration-500 overflow-hidden">
        
        <header class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter leading-none">Reality_Fragments</h3>
            <p class="text-indigo-500/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Project_Context_Index</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 rounded-full text-slate-400 active:scale-90 transition-all hover:bg-white/10 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 pr-2 custom-scrollbar touch-pan-y overscroll-contain">
          @for (scene of scenes; track scene.id) {
            @let isActive = engine.sceneManager.currentScene()?.id === scene.id;
            <div class="group relative flex flex-col p-5 md:p-8 rounded-[2rem] border transition-all pointer-events-auto"
              [class.bg-indigo-600/20]="isActive"
              [class.border-indigo-500/40]="isActive"
              [class.bg-white/5]="!isActive"
              [class.border-white/5]="!isActive">
              
              <div class="flex items-center justify-between mb-4">
                <div class="px-2.5 py-1 bg-black/40 rounded-lg border border-white/5 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:text-white transition-colors">
                  {{ scene.complexity }}
                </div>
                <div class="flex gap-2">
                  <button (click)="select.emit(scene.id)" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              <h4 class="text-white font-black text-lg md:text-2xl mb-1 md:mb-2 group-hover:translate-x-1 transition-transform">{{ scene.name }}</h4>
              <p class="text-slate-400 text-[10px] md:text-xs leading-relaxed line-clamp-2 mb-6">{{ scene.description }}</p>

              <div class="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
                @for (tag of scene.tags; track tag) {
                  <span class="text-[7px] text-slate-500 font-black uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded">{{ tag }}</span>
                }
              </div>

              @if (isActive) {
                <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] border-2 border-slate-900"></div>
              }
            </div>
          }
          
          <!-- Create New Logic (Placeholder UI) -->
          <button class="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-slate-500 hover:text-indigo-400 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="mb-3 group-hover:scale-110 transition-transform"><path d="M5 12h14m-7-7v14"/></svg>
            <span class="text-[9px] font-black uppercase tracking-widest">Construct_Fragment</span>
          </button>
        </div>

        <footer class="pt-4 border-t border-white/5 flex items-center justify-between">
          <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active_Kernel: {{ engine.sceneManager.currentScene()?.id || 'idle' }}</span>
          <div class="flex gap-2">
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500/30"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500/60"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
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