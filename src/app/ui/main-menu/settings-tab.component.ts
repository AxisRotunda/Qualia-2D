import { Component, inject, output } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';

@Component({
  selector: 'app-menu-settings-tab',
  standalone: true,
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto pt-36 pb-24 px-6 md:px-12 animate-in fade-in zoom-in-95 duration-700">
        <header class="mb-16">
          <h2 class="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">Config_Hub</h2>
          <p class="text-rose-500 text-xs font-black uppercase tracking-[0.5em]">System-Level Environment Variables</p>
        </header>
        <div class="max-w-3xl space-y-4">
          <div (click)="toggleGrid.emit()" class="group p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md border border-white/5 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <div>
                <div class="text-white font-black text-xl tracking-tight uppercase">Coordinate Grid</div>
                <div class="text-slate-500 text-sm">Visualize the underlying mathematical plane.</div>
              </div>
            </div>
            <div class="w-14 h-8 rounded-full border border-white/10 relative transition-colors" [class.bg-indigo-600]="state.gridVisible()" [class.bg-slate-950]="!state.gridVisible()">
              <div class="absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300" [class.translate-x-6]="state.gridVisible()"></div>
            </div>
          </div>
          <div (click)="toggleDebug.emit()" class="group p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md border border-white/5 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white"><circle cx="12" cy="12" r="10"/><path d="M14.83 9.17a4 4 0 0 0-5.66 5.66"/></svg>
              </div>
              <div>
                <div class="text-white font-black text-xl tracking-tight uppercase">Physics Debugger</div>
                <div class="text-slate-500 text-sm">Real-time overlay of collision hulls and sensors.</div>
              </div>
            </div>
            <div class="w-14 h-8 rounded-full border border-white/10 relative transition-colors" [class.bg-rose-600]="state.debugPhysics()" [class.bg-slate-950]="!state.debugPhysics()">
              <div class="absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300" [class.translate-x-6]="state.debugPhysics()"></div>
            </div>
          </div>
          
          <div class="pt-12">
            <button (click)="clearStorage.emit()" class="px-8 py-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95">
              Reset Engine State (Factory Default)
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuSettingsTabComponent {
  state = inject(EngineState2DService);
  toggleGrid = output<void>();
  toggleDebug = output<void>();
  clearStorage = output<void>();
}