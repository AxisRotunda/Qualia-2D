
import { Component, inject } from '@angular/core';
import { Engine2DService } from '../../services/engine-2d.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  template: `
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="flex items-center justify-between mb-10">
        <h2 class="text-white font-black text-xl uppercase tracking-tighter">Hierarchy</h2>
        <button (click)="state.setActivePanel('none')" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
        </button>
      </header>
      <div class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        @for (id of engine.ecs.entitiesList(); track id) {
          <div (click)="state.selectedEntityId.set(id)"
            class="group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer"
            [class.bg-indigo-600]="state.selectedEntityId() === id"
            [class.border-indigo-400/30]="state.selectedEntityId() === id"
            [class.border-white/5]="state.selectedEntityId() !== id"
            [class.hover:bg-white/5]="state.selectedEntityId() !== id">
            <span class="text-xs font-bold uppercase tracking-wide" 
              [class.text-white]="state.selectedEntityId() === id" 
              [class.text-slate-400]="state.selectedEntityId() !== id">
              {{ engine.ecs.tags.get(id)?.name || 'Entity_' + id }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 2px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class HierarchyComponent {
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
}
