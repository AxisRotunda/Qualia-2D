import { Component, inject, output } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { Engine2DService } from '../../../services/engine-2d.service';

@Component({
  selector: 'app-command-hub',
  template: `
    <nav class="flex items-center gap-3 bg-slate-950/60 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
      
      <!-- Panel Toggles -->
      <div class="flex items-center gap-1.5 pr-3 border-r border-white/10">
        <button 
          (click)="state.setOverlay('main-menu')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90 text-slate-400 hover:text-white"
          aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>

        <!-- Hierarchy Toggle (Layers Icon) -->
        <button 
          (click)="state.setActivePanel('hierarchy')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90"
          [class.bg-indigo-600]="state.activePanel() === 'hierarchy'"
          [class.text-white]="state.activePanel() === 'hierarchy'"
          [class.text-slate-400]="state.activePanel() !== 'hierarchy'"
          title="Scene Hierarchy">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 12 8-4.5-8-4.5L4 7.5 12 12Z"/><path d="m12 21 8-4.5-8-4.5L4 16.5 12 21Z"/><path d="m4 12 8 4.5 8-4.5"/></svg>
        </button>
        
        <!-- Scene Inspector Toggle (Map/Globe Icon) -->
        <button 
          (click)="state.setActivePanel('scene-inspector')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90 relative"
          [class.bg-indigo-600]="state.activePanel() === 'scene-inspector'"
          [class.text-white]="state.activePanel() === 'scene-inspector'"
          [class.text-slate-400]="state.activePanel() !== 'scene-inspector'"
          title="World Atmosphere">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>
          @if (state.activePanel() === 'scene-inspector') {
            <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-400 rounded-full border border-slate-900 shadow-sm"></div>
          }
        </button>

        <!-- Engine Settings Toggle (Sliders Icon) -->
        <button 
          (click)="state.setActivePanel('settings')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90"
          [class.bg-indigo-600]="state.activePanel() === 'settings'"
          [class.text-white]="state.activePanel() === 'settings'"
          [class.text-slate-400]="state.activePanel() !== 'settings'"
          title="Engine Config">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>
        </button>
      </div>

      <!-- Main Actions -->
      <div class="flex items-center gap-3">
        <button (click)="engine.resetScene()" class="w-12 h-12 rounded-full bg-slate-900/80 text-slate-400 flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5 active:rotate-[-90deg]" title="Reset Simulation">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>

        <button 
          (click)="engine.togglePlay()"
          class="w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] active:scale-90"
          [class.bg-emerald-500]="state.mode() !== 'play'"
          [class.bg-amber-500]="state.mode() === 'play'"
          aria-label="Toggle Mode">
          @if (state.mode() === 'edit') {
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          }
        </button>

        <button 
          (click)="create.emit()"
          class="bg-indigo-600 hover:bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-[0_8px_16px_-4px_rgba(79,70,229,0.5)]"
          title="Spawn Object">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14m-7-7v14"/></svg>
        </button>
      </div>
    </nav>
  `
})
export class CommandHubComponent {
  public state = inject(EngineState2DService);
  public engine = inject(Engine2DService);
  public create = output<void>();
}
