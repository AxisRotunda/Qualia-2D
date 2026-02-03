
import { Component, inject } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';

@Component({
  selector: 'app-engine-settings',
  standalone: true,
  template: `
    <div class="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <!-- Topology Selector -->
      <div class="space-y-4">
        <label class="block text-slate-500 text-[9px] uppercase font-black tracking-widest px-1">Control Topology</label>
        <div class="grid grid-cols-1 gap-2">
          @for (topo of topologies; track topo) {
            <button (click)="state.setTopology(topo)" 
              class="w-full p-5 rounded-[2rem] border text-left transition-all active:scale-95 flex items-center justify-between group"
              [class.bg-indigo-600]="state.topology() === topo" 
              [class.border-indigo-400/30]="state.topology() === topo" 
              [class.border-white/5]="state.topology() !== topo">
              <span class="text-[10px] font-black uppercase text-white tracking-wide group-hover:translate-x-1 transition-transform">
                {{ topo.replace('-', ' ') }}
              </span>
              @if (state.topology() === topo) {
                <div class="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
              }
            </button>
          }
        </div>
      </div>

      <!-- System Toggles -->
      <div class="space-y-4">
        <label class="block text-slate-500 text-[9px] uppercase font-black tracking-widest px-1">Visual Debug</label>
        <div class="grid grid-cols-2 gap-3">
          <button (click)="state.toggleGrid()" 
            class="p-5 rounded-[2rem] border transition-all active:scale-95 flex flex-col gap-3" 
            [class.bg-indigo-600/20]="state.gridVisible()" 
            [class.border-indigo-500/30]="state.gridVisible()" 
            [class.border-white/5]="!state.gridVisible()">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <span class="text-[9px] font-black uppercase tracking-widest text-white">Grid</span>
          </button>
          
          <button (click)="state.toggleDebugPhysics()" 
            class="p-5 rounded-[2rem] border transition-all active:scale-95 flex flex-col gap-3" 
            [class.bg-rose-600/20]="state.debugPhysics()" 
            [class.border-rose-500/30]="state.debugPhysics()" 
            [class.border-white/5]="!state.debugPhysics()">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-rose-400"><circle cx="12" cy="12" r="10"/><path d="M14.83 9.17a4 4 0 0 0-5.66 5.66"/></svg>
            </div>
            <span class="text-[9px] font-black uppercase tracking-widest text-white">Physics</span>
          </button>
        </div>
      </div>

      <!-- Environment -->
      <div class="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
         <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">Simulation Gravity</label>
         <div class="flex items-center gap-4">
            <input type="range" min="-20" max="20" step="0.1" [value]="state.gravityY()" (input)="state.updateGravity($any($event.target).value)"
              class="flex-1 accent-indigo-500">
            <span class="text-xs font-mono font-bold text-white w-12 text-right">{{ state.gravityY() | number:'1.1-1' }}</span>
         </div>
      </div>
    </div>
  `
})
export class EngineSettingsComponent {
  state = inject(EngineState2DService);
  topologies: any[] = ['platformer', 'top-down-rpg', 'top-down-action'];
}
