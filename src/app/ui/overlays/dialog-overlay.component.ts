import { Component, inject } from '@angular/core';
import { GameSessionService } from '../../../services/game-session.service';

@Component({
  selector: 'app-dialog-overlay',
  standalone: true,
  template: `
    @if (session.activeDialog(); as d) {
      <div class="absolute bottom-8 left-0 right-0 z-[80] flex justify-center px-6 animate-in slide-in-from-bottom-4 duration-300">
        <div class="w-full max-w-3xl bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden pointer-events-auto">
          
          <!-- Decorative Glow -->
          <div class="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>

          <div class="relative z-10 flex flex-col gap-3">
             <div class="flex items-center gap-3 mb-1">
               <div class="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest text-indigo-300">
                 {{ d.speaker }}
               </div>
               <div class="h-px flex-1 bg-white/5"></div>
               <div class="text-[8px] text-slate-500 uppercase font-black tracking-widest animate-pulse">Waiting Input</div>
             </div>
             
             <p class="text-lg md:text-xl text-white font-medium leading-relaxed tracking-tight">
               {{ d.text }}
             </p>

             <div class="absolute bottom-4 right-6 text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="animate-bounce"><path d="m6 9 6 6 6-6"/></svg>
             </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DialogOverlayComponent {
  session = inject(GameSessionService);
}