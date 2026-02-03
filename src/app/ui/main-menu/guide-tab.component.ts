import { Component, inject, signal, computed, output } from '@angular/core';
import { DocumentationService, VisualArticle } from '../../../services/documentation.service';

@Component({
  selector: 'app-menu-guide-tab',
  standalone: true,
  template: `
    <!-- SCROLL CONTAINER: Crucial for allowing content to slide behind floating nav -->
    <div class="h-full overflow-y-auto custom-scrollbar">
      
      <!-- Content Wrapper with Padding for Nav Clearance -->
      <div class="max-w-7xl mx-auto pt-36 pb-24 px-6 md:px-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <!-- HERO HEADER -->
        <header class="text-center space-y-4 max-w-3xl mx-auto">
          <h2 class="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
            Human<br/><span class="text-indigo-500">Translations</span>
          </h2>
          <p class="text-slate-500 text-sm md:text-lg font-medium tracking-tight">
            De-coded knowledge fragments explaining the core logic of the Qualia2D planar environment.
          </p>
        </header>

        <!-- MODULE GRID SELECTION -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (module of docs.modules; track module.id) {
            <button (click)="selectModule(module.id)"
              class="group relative text-left p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md transition-all active:scale-[0.98] overflow-hidden flex flex-col gap-8 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-2xl">
              
              <!-- Icon / Visual Identity -->
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                @if (module.schemaId === 'movement') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
                } @else if (module.schemaId === 'physics') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>
                } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                }
              </div>

              <div class="space-y-3">
                <span class="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/60 group-hover:text-indigo-400 transition-colors">Protocol_{{ module.category }}</span>
                <h3 class="text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">{{ module.title }}</h3>
                <p class="text-xs md:text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">{{ module.description }}</p>
              </div>

              <div class="flex items-center gap-4 pt-4 border-t border-white/5">
                <span class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-indigo-300 transition-colors">Translate Logic</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-indigo-500 group-hover:translate-x-1 transition-transform">
                  <path d="M9 18 15 12 9 6"></path>
                </svg>
              </div>
            </button>
          }
        </div>
      </div>
    </div>

    <!-- IMMERSIVE DETAIL ESCAPEMENT -->
    @if (activeModule(); as m) {
      <div class="fixed inset-0 z-[100] bg-[#020617] flex flex-col animate-in slide-in-from-right-8 duration-500 overflow-hidden">
          
          <!-- Detail Scroll Container -->
          <div class="h-full overflow-y-auto custom-scrollbar">
            <div class="min-h-full p-6 md:p-16 flex flex-col">
              
              <!-- Back Nav -->
              <div class="mb-12 sticky top-0 z-20 pt-4">
                <button (click)="closeDetail()" class="px-6 py-2.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 text-slate-400 hover:text-white transition-all active:scale-95 group shadow-2xl w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-widest">Return to Hub</span>
                </button>
              </div>

              <main class="flex-1 flex flex-col xl:flex-row gap-16 md:gap-24 max-w-7xl mx-auto w-full">
                <!-- Left Content (Info) -->
                <div class="xl:w-2/5 space-y-12 shrink-0">
                    <div class="space-y-6">
                      <div class="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/80">Transmission: {{ m.schemaId }}</div>
                      <h1 class="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase drop-shadow-2xl">
                          {{ m.title.split(' ')[0] }}<br/>
                          <span class="text-indigo-500">{{ m.title.split(' ')[1] || '' }}</span>
                      </h1>
                      <div class="p-6 md:p-8 bg-white/[0.03] border-l-4 border-indigo-500 rounded-r-3xl text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                          {{ m.description }}
                      </div>
                    </div>

                    @if (m.simulationSceneId) {
                      <div class="flex items-center gap-6 p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-white/5">
                          <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
                          </div>
                          <div class="flex-1">
                            <div class="text-white font-black uppercase text-xs tracking-widest">Linked Fragment</div>
                            <div class="text-[9px] md:text-[10px] text-slate-500 uppercase font-black tracking-widest">Auto-loads on scene select</div>
                          </div>
                      </div>
                    }
                </div>

                <!-- Right Content (Steps) -->
                <div class="flex-1 space-y-4 pb-20">
                    <div class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-white/5 pb-4">Architectural_Directives</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      @for (step of m.steps; track step.label) {
                          <div class="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group flex flex-col gap-6">
                            <div class="w-12 h-12 rounded-[1.2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                  <path [attr.d]="step.icon"></path>
                                </svg>
                            </div>
                            <div class="space-y-2">
                                <div class="text-xs md:text-sm font-black uppercase tracking-widest text-white">{{ step.label }}</div>
                                <div class="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">{{ step.detail }}</div>
                            </div>
                          </div>
                      }
                    </div>
                </div>
              </main>
            </div>
          </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuGuideTabComponent {
  docs = inject(DocumentationService);
  
  // State
  selectedModuleId = signal<string | null>(null);
  
  // Derived
  activeModule = computed(() => {
    const id = this.selectedModuleId();
    return id ? this.docs.getModule(id) : null;
  });
  
  // Events
  launch = output<VisualArticle>();

  selectModule(id: string) {
    this.selectedModuleId.set(id);
  }

  closeDetail() {
    this.selectedModuleId.set(null);
  }
}