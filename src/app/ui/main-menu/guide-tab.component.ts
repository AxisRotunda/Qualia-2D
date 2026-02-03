import { Component, inject, signal, computed, output } from '@angular/core';
import { DocumentationService, VisualArticle } from '../../../services/documentation.service';
import { MenuGuideDetailComponent } from './guide-detail.component';

@Component({
  selector: 'app-menu-guide-tab',
  standalone: true,
  imports: [MenuGuideDetailComponent],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto pt-36 pb-24 px-6 md:px-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <header class="text-center space-y-4 max-w-3xl mx-auto">
          <h2 class="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
            Human<br/><span class="text-indigo-500">Translations</span>
          </h2>
          <p class="text-slate-500 text-sm md:text-lg font-medium tracking-tight">
            De-coded knowledge fragments explaining the core logic of the Qualia2D planar environment.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (module of docs.modules; track module.id) {
            <button (click)="selectedModuleId.set(module.id)"
              class="group relative text-left p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md transition-all active:scale-[0.98] overflow-hidden flex flex-col gap-8 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-2xl">
              
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <!-- SCHEMA ICON MAPPING -->
                @if (module.schemaId === 'movement') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
                } @else if (module.schemaId === 'physics') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>
                } @else if (module.schemaId === 'input') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h-2v-2h2V8h2v2h2v2h-2v2h-2v-2z"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
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

    <!-- IMMERSIVE DETAIL VIEW -->
    @if (activeModule(); as m) {
      <app-menu-guide-detail [article]="m" (close)="selectedModuleId.set(null)" />
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuGuideTabComponent {
  docs = inject(DocumentationService);
  selectedModuleId = signal<string | null>(null);
  activeModule = computed(() => {
    const id = this.selectedModuleId();
    return id ? this.docs.getModule(id) : null;
  });
  launch = output<VisualArticle>();
}