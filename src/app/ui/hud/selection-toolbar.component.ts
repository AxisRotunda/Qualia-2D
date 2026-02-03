import { Component, inject, input } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';

@Component({
  selector: 'app-selection-toolbar',
  standalone: true,
  template: `
    <div class="flex items-center gap-2 bg-slate-900/80 backdrop-blur-3xl p-1.5 rounded-full border border-white/10 shadow-2xl z-60 animate-in zoom-in-95 fade-in duration-200">
      <button (click)="engine.deleteEntity(entityId())" 
        class="w-10 h-10 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-full transition-all active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
      <div class="h-6 w-px bg-white/10"></div>
      <button (click)="state.setActivePanel('inspector')" 
        class="px-5 h-10 flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 rounded-full transition-colors active:scale-95">
        Inspect #{{ entityId() }}
      </button>
    </div>
  `
})
export class SelectionToolbarComponent {
  entityId = input.required<number>();
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
}