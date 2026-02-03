import { Component, inject, output } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { Engine2DService } from '../../../services/engine-2d.service';

@Component({
  selector: 'app-command-hub',
  standalone: true,
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

        <button 
          (click)="state.setActivePanel('hierarchy')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90"
          [class.bg-indigo-600]="state.activePanel() === 'hierarchy'"
          [class.text-white]="state.activePanel() === 'hierarchy'"
          [class.text-slate-400]="state.activePanel() !== 'hierarchy'"
          aria-label="Hierarchy">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
        </button>
        <button 
          (click)="state.setActivePanel('settings')"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/5 active:scale-90"
          [class.bg-indigo-600]="state.activePanel() === 'settings'"
          [class.text-white]="state.activePanel() === 'settings'"
          [class.text-slate-400]="state.activePanel() !== 'settings'"
          aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>

      <!-- Main Actions -->
      <div class="flex items-center gap-3">
        <button (click)="engine.resetScene()" class="w-12 h-12 rounded-full bg-slate-900/80 text-slate-400 flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5 active:rotate-[-90deg]" aria-label="Reset Scene">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>

        <button 
          (click)="engine.togglePlay()"
          class="w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] active:scale-90"
          [class.bg-emerald-500]="state.mode() !== 'play'"
          [class.bg-amber-500]="state.mode() === 'play'"
          aria-label="Toggle Play/Edit">
          @if (state.mode() === 'edit') {
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          }
        </button>

        <button 
          (click)="create.emit()"
          class="bg-indigo-600 hover:bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-[0_8px_16px_-4px_rgba(79,70,229,0.5)]"
          aria-label="Create Entity">
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