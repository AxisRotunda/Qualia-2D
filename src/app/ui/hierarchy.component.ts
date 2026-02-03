
import { Component, inject } from '@angular/core';
import { Engine2DService } from '../../services/engine-2d.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  template: `
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
      @if (engine.ecs.entitiesList().length === 0) {
        <div class="py-20 text-center">
          <p class="text-[9px] text-slate-700 font-black uppercase tracking-widest">Reality is Empty</p>
        </div>
      }
    </div>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 2px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
    </style>
  `
})
export class HierarchyComponent {
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
}
