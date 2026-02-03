
import { Component, inject, output } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';

@Component({
  selector: 'app-create-menu-overlay',
  standalone: true,
  template: `
    <div (click)="close.emit()" class="absolute inset-0 z-80 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300 pointer-events-auto touch-none">
      <div (click)="$event.stopPropagation()" class="w-full max-w-sm bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-300 pointer-events-auto">
        <div class="flex items-center justify-between">
          <h3 class="text-white font-black text-xl uppercase tracking-tighter">Create Entity</h3>
          <button (click)="close.emit()" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-slate-400 active:scale-90 transition-all hover:bg-white/10 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3">
          @for (tpl of engine.templates; track tpl.id) {
            <button (click)="spawn.emit(tpl.id); $event.stopPropagation()" class="group flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/40 transition-all active:scale-95 pointer-events-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-500 group-hover:text-indigo-400 transition-colors">
                <path [attr.d]="tpl.icon"></path>
              </svg>
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{{ tpl.name }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class CreateMenuOverlayComponent {
  engine = inject(Engine2DService);
  spawn = output<string>();
  close = output<void>();
}
