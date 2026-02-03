import { Component, input, output } from '@angular/core';
import { VisualArticle } from '../../../services/documentation.service';

@Component({
  selector: 'app-menu-guide-detail',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-[100] bg-[#020617] flex flex-col animate-in slide-in-from-right-8 duration-500 overflow-hidden">
        <div class="h-full overflow-y-auto custom-scrollbar">
          <div class="min-h-full p-6 md:p-16 flex flex-col">
            
            <div class="mb-12 sticky top-0 z-20 pt-4">
              <button (click)="close.emit()" class="px-6 py-2.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 text-slate-400 hover:text-white transition-all active:scale-95 group shadow-2xl w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Return to Hub</span>
              </button>
            </div>

            <main class="flex-1 flex flex-col xl:flex-row gap-16 md:gap-24 max-w-7xl mx-auto w-full">
              <div class="xl:w-2/5 space-y-12 shrink-0">
                  <div class="space-y-6">
                    <div class="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/80">Transmission: {{ article().schemaId }}</div>
                    <h1 class="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase drop-shadow-2xl">
                        {{ article().title.split(' ')[0] }}<br/>
                        <span class="text-indigo-500">{{ article().title.split(' ')[1] || '' }}</span>
                    </h1>
                    <div class="p-6 md:p-8 bg-white/[0.03] border-l-4 border-indigo-500 rounded-r-3xl text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                        {{ article().description }}
                    </div>
                  </div>

                  @if (article().simulationSceneId) {
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

              <div class="flex-1 space-y-4 pb-20">
                  <div class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-white/5 pb-4">Architectural_Directives</div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @for (step of article().steps; track step.label) {
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
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuGuideDetailComponent {
  article = input.required<VisualArticle>();
  close = output<void>();
}