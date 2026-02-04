import { Component, inject, output, signal, computed } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { BLUEPRINTS, EntityBlueprint } from '../../../data/prefabs/entity-blueprints';

@Component({
  selector: 'app-create-menu-overlay',
  standalone: true,
  template: `
    <div (click)="close.emit()" class="absolute inset-0 z-80 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300 pointer-events-auto touch-none">
      <div (click)="$event.stopPropagation()" class="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-10 flex flex-col gap-10 animate-in zoom-in-95 duration-300 pointer-events-auto max-h-[85vh] overflow-hidden">
        
        <!-- Header Section -->
        <div class="flex items-center justify-between shrink-0">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-[0_0_20px_rgba(99,102,241,0.5)]">FAB</div>
               <h3 class="text-4xl font-black text-white uppercase tracking-tighter">Fabricator</h3>
            </div>
            <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <p class="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Querying_Asset_Registry: <span class="text-white">{{ blueprints.length }} NODES</span></p>
            </div>
          </div>
          <button (click)="close.emit()" class="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full text-slate-400 active:scale-90 transition-all hover:bg-white/10 hover:text-white shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
          </button>
        </div>

        <!-- Filter & Navigation -->
        <div class="flex flex-col gap-6 shrink-0">
          <!-- Search Architecture -->
          <div class="relative group">
             <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-600 group-focus-within:text-indigo-400 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </div>
             <input type="text" placeholder="Search Entity DNA..." 
               [value]="searchTerm()" (input)="searchTerm.set($any($event.target).value)"
               class="w-full bg-slate-900 border border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700 uppercase tracking-widest">
          </div>

          <!-- Category Chipset -->
          <div class="flex gap-2 overflow-x-auto pb-4 custom-scrollbar-hide">
            @for (cat of categories; track cat) {
              <button (click)="activeCategory.set(cat)"
                class="px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border active:scale-95 flex items-center gap-2"
                [class.bg-indigo-600]="activeCategory() === cat"
                [class.border-indigo-500]="activeCategory() === cat"
                [class.text-white]="activeCategory() === cat"
                [class.bg-white/5]="activeCategory() !== cat"
                [class.border-white/5]="activeCategory() !== cat"
                [class.text-slate-500]="activeCategory() !== cat"
                [class.hover:bg-white/10]="activeCategory() !== cat">
                @if (activeCategory() === cat) {
                  <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></div>
                }
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <!-- Asset Grid View -->
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-3 -mr-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            @for (bp of filteredBlueprints(); track bp.id) {
              <button (click)="spawn.emit(bp.id); close.emit()" 
                class="group flex flex-col p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 hover:bg-indigo-600/5 hover:border-indigo-500/30 transition-all active:scale-[0.98] text-left relative overflow-hidden shadow-lg">
                
                <div class="flex items-start justify-between mb-6 relative z-10">
                   <div class="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path [attr.d]="bp.icon"></path>
                      </svg>
                   </div>
                   <div class="flex flex-col items-end gap-1.5">
                      <div class="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[7px] font-black uppercase text-indigo-400 tracking-widest">
                        {{ bp.category }}
                      </div>
                      <div class="flex gap-0.5">
                        @for (i of [1,2,3,4,5]; track i) {
                          <div class="w-1 h-1 rounded-full" [class.bg-indigo-500]="i <= (bp.complexity / 2)" [class.bg-white/10]="i > (bp.complexity / 2)"></div>
                        }
                      </div>
                   </div>
                </div>
                
                <div class="space-y-1 relative z-10">
                  <h4 class="text-lg font-black uppercase text-white group-hover:text-indigo-300 transition-colors tracking-tighter">{{ bp.name }}</h4>
                  <p class="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2">{{ bp.description }}</p>
                </div>

                <div class="mt-6 flex items-center justify-between relative z-10 border-t border-white/5 pt-4 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div class="flex gap-2">
                      @if (bp.components.physics?.type === 'dynamic') {
                        <span class="text-[7px] font-black uppercase text-amber-500">Dynamic</span>
                      } @else {
                        <span class="text-[7px] font-black uppercase text-slate-600">Static</span>
                      }
                      <span class="text-[7px] font-black uppercase text-slate-600">ID:{{ bp.id.split('_').pop() }}</span>
                   </div>
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-indigo-500 group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                   </svg>
                </div>

                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </button>
            }
          </div>
          
          @if (filteredBlueprints().length === 0) {
             <div class="py-24 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in-95">
               <div class="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-slate-800">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <div class="text-center space-y-1">
                 <p class="text-xs font-black uppercase tracking-[0.4em] text-slate-700">Database_Query_Null</p>
                 <p class="text-[8px] text-slate-800 uppercase font-black tracking-widest">No matching DNA sequences found</p>
               </div>
             </div>
          }
        </div>

      </div>
    </div>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
    </style>
  `
})
export class CreateMenuOverlayComponent {
  engine = inject(Engine2DService);
  spawn = output<string>();
  close = output<void>();

  blueprints = BLUEPRINTS;
  categories = ['all', 'primitive', 'logistics', 'structure', 'mechanism', 'hazard', 'interactive'];
  activeCategory = signal('all');
  searchTerm = signal('');

  filteredBlueprints = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.activeCategory();
    
    return this.blueprints.filter(bp => {
      const matchesSearch = bp.name.toLowerCase().includes(term) || bp.id.toLowerCase().includes(term);
      const matchesCat = cat === 'all' || bp.category === cat;
      return matchesSearch && matchesCat;
    });
  });
}