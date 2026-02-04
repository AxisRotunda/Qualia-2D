import { Component, inject, signal, computed } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  template: `
    <div class="flex flex-col h-full select-none">
      
      <!-- Filter Bar -->
      <div class="mb-4 space-y-2">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-500 group-focus-within:text-indigo-400 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search Graph..." 
            [value]="searchTerm()"
            (input)="searchTerm.set($any($event.target).value)"
            class="w-full bg-slate-900/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-[10px] font-bold text-white placeholder:text-slate-600 focus:border-indigo-500/40 outline-none transition-all uppercase tracking-wide">
        </div>
      </div>

      <!-- Entity List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-0.5">
        @for (id of filteredEntities(); track id) {
          <div 
            (click)="select(id)"
            class="group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all border border-transparent"
            [class.bg-indigo-600]="state.selectedEntityId() === id"
            [class.text-white]="state.selectedEntityId() === id"
            [class.hover:bg-white/5]="state.selectedEntityId() !== id"
            [class.text-slate-400]="state.selectedEntityId() !== id">
            
            <div class="flex items-center gap-2 min-w-0">
              <!-- Context Icon -->
              <div class="shrink-0 opacity-70">
                @if (engine.ecs.players.has(id)) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                } @else if (engine.ecs.forceFields.has(id)) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
                } @else if (engine.ecs.rigidBodies.get(id)?.bodyType === 'dynamic') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
                }
              </div>
              
              <span class="text-[10px] font-bold uppercase tracking-tight truncate">
                {{ engine.ecs.tags.get(id)?.name || 'Entity_' + id }}
              </span>
            </div>

            <!-- Hover Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button (click)="focus($event, id)" class="p-1 hover:bg-white/20 rounded hover:text-white" title="Focus">
                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </button>
               <button (click)="delete($event, id)" class="p-1 hover:bg-rose-500/20 rounded hover:text-rose-400" title="Delete">
                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
               </button>
            </div>
          </div>
        }
        @if (filteredEntities().length === 0) {
          <div class="py-12 flex flex-col items-center justify-center opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mb-2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <p class="text-[8px] font-black uppercase tracking-widest">No Matches</p>
          </div>
        }
      </div>

      <!-- Footer -->
      <footer class="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono font-bold text-slate-600">
         <span>ROOT</span>
         <span>{{ engine.ecs.entityCount() }} NODES</span>
      </footer>
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
  
  searchTerm = signal('');

  filteredEntities = computed(() => {
    const all = this.engine.ecs.entitiesList();
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return all;

    return all.filter(id => {
      const tag = this.engine.ecs.tags.get(id);
      return tag ? tag.name.toLowerCase().includes(term) : false;
    });
  });

  select(id: number) {
    this.state.selectedEntityId.set(id);
  }

  focus(e: Event, id: number) {
    e.stopPropagation();
    this.engine.focusEntity(id);
    this.state.selectedEntityId.set(id);
  }

  delete(e: Event, id: number) {
    e.stopPropagation();
    this.engine.deleteEntity(id);
  }
}