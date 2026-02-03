
import { Component, inject, signal, computed, output } from '@angular/core';
import { DocumentationService, VisualArticle } from '../../../services/documentation.service';

@Component({
  selector: 'app-menu-guide-tab',
  standalone: true,
  template: `
    <div class="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="p-8 md:p-16 flex-1 flex flex-col overflow-hidden">
        <header class="mb-12">
          <h2 class="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">Sim_Guide</h2>
          <p class="text-emerald-500 text-xs font-black uppercase tracking-[0.5em]">Human Translations of Engine Logic</p>
        </header>

        <div class="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
          <!-- Master List -->
          <div class="w-full md:w-80 space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-none">
            @for (module of docs.modules; track module.id) {
              <button (click)="selectedModuleId.set(module.id)"
                class="w-full p-6 rounded-[2rem] border text-left transition-all active:scale-95 group relative overflow-hidden flex flex-col justify-between aspect-[1.8/1] md:aspect-auto"
                [class.bg-indigo-600]="selectedModuleId() === module.id"
                [class.border-indigo-400]="selectedModuleId() === module.id"
                [class.bg-slate-900/40]="selectedModuleId() !== module.id"
                [class.border-white/5]="selectedModuleId() !== module.id"
                [class.hover:border-white/10]="selectedModuleId() !== module.id">
                
                <div class="relative z-10">
                  <span class="text-[8px] font-black uppercase tracking-[0.3em] mb-2 block" 
                    [class.text-indigo-200]="selectedModuleId() === module.id"
                    [class.text-slate-500]="selectedModuleId() !== module.id">
                    {{ module.humanLabel }}
                  </span>
                  <div class="text-xl font-black text-white leading-tight uppercase tracking-tight">{{ module.title }}</div>
                </div>

                <div class="relative z-10 flex justify-end">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/20"
                    [class.bg-white/20]="selectedModuleId() === module.id">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
                      [class.text-white]="selectedModuleId() === module.id"
                      [class.text-indigo-500]="selectedModuleId() !== module.id">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>
            }
          </div>

          <!-- Detail Viewer -->
          <div class="flex-1 bg-slate-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden relative">
            @if (activeModule(); as m) {
              <div class="p-8 md:p-12 flex flex-col h-full animate-in zoom-in-95 duration-500">
                <div class="flex-1 flex flex-col xl:flex-row gap-12 overflow-y-auto custom-scrollbar">
                  <div class="flex-1 space-y-10">
                    <div>
                      <span class="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] block mb-4">Functional_Protocol</span>
                      <h3 class="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">{{ m.title }}</h3>
                      <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">{{ m.description }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      @for (step of m.steps; track step.label) {
                        <div class="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:bg-white/10 transition-colors">
                          <div class="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400">
                              <path [attr.d]="step.icon"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-[10px] font-black uppercase tracking-widest text-white mb-1">{{ step.label }}</div>
                            <div class="text-slate-500 text-xs leading-snug">{{ step.detail }}</div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Schematic Panel -->
                  <div class="w-full xl:w-80 flex-none flex flex-col items-center justify-center p-8 bg-black/20 rounded-[2.5rem] border border-white/5 relative overflow-hidden min-h-[300px]">
                    <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)]"></div>
                    <div class="relative w-full aspect-square flex items-center justify-center">
                      <div class="absolute inset-0 border-[2px] border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                      
                      @if (m.schemaId === 'movement') {
                        <div class="flex flex-col items-center gap-6 animate-pulse">
                          <div class="w-16 h-16 bg-indigo-600 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                          </div>
                          <div class="h-1.5 w-32 bg-white/5 rounded-full relative overflow-hidden">
                            <div class="absolute inset-y-0 left-0 bg-indigo-400 w-2/3"></div>
                          </div>
                        </div>
                      } @else if (m.schemaId === 'physics') {
                        <div class="relative flex items-center justify-center">
                          <div class="w-40 h-40 border border-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                            <div class="w-20 h-20 border-2 border-white/5 rounded-full flex items-center justify-center">
                              <div class="w-8 h-8 bg-indigo-500 rounded-full shadow-[0_0_30px_indigo]"></div>
                            </div>
                          </div>
                        </div>
                      } @else {
                        <div class="grid grid-cols-2 gap-4 scale-125">
                          <div class="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center bg-white/5"><div class="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div></div>
                          <div class="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center"><div class="w-4 h-0.5 bg-slate-700"></div></div>
                          <div class="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center"><div class="w-0.5 h-4 bg-slate-700"></div></div>
                          <div class="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center bg-indigo-600 shadow-lg"><div class="w-2 h-2 bg-white rounded-full"></div></div>
                        </div>
                      }
                    </div>
                    <div class="mt-8 text-center relative z-10">
                      <div class="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-1">Visual_Node</div>
                      <div class="text-[7px] text-slate-700 font-mono">ENCODING: 0x2A1F7B</div>
                    </div>
                  </div>
                </div>

                <footer class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between mt-8 gap-6">
                  <div class="flex items-center gap-4">
                    <div class="flex -space-x-3">
                      <div class="w-10 h-10 rounded-full border-2 border-[#020617] bg-indigo-600 flex items-center justify-center text-[10px] font-black">Q</div>
                      <div class="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-black">AI</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-black text-white uppercase tracking-widest">Logic Stream Verified</div>
                      <div class="text-[8px] text-slate-500 uppercase font-bold tracking-tight">Translation Latency: 0.14ms</div>
                    </div>
                  </div>
                  <button (click)="launch.emit(m)" 
                    class="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]">
                    Execute Live Translation
                  </button>
                </footer>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuGuideTabComponent {
  docs = inject(DocumentationService);
  selectedModuleId = signal<string>('movement_dna');
  activeModule = computed(() => this.docs.getModule(this.selectedModuleId()));
  launch = output<VisualArticle>();
}
