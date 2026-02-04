import { Component, inject, computed } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { ComponentStoreService } from '../../../engine/ecs/component-store.service';
import { MemorySystem2DService } from '../../../services/memory-2d.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="flex items-center gap-1 bg-slate-950/60 backdrop-blur-3xl border border-white/10 px-5 py-2 rounded-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] pointer-events-auto">
      
      <!-- Simulation Pillar -->
      <div class="flex items-center gap-3 pr-5 border-r border-white/5">
        <div class="relative flex items-center justify-center">
          <span class="w-2.5 h-2.5 rounded-full animate-pulse blur-[1px]" 
            [class.bg-emerald-500]="state.mode() === 'play'" 
            [class.bg-amber-500]="state.mode() === 'edit'">
          </span>
          <span class="absolute w-2.5 h-2.5 rounded-full opacity-40 animate-ping"
            [class.bg-emerald-400]="state.mode() === 'play'" 
            [class.bg-amber-400]="state.mode() === 'edit'">
          </span>
        </div>
        <div class="flex flex-col -space-y-1">
          <span class="text-[10px] font-black uppercase tracking-tight text-white">{{ state.statusText() }}</span>
          <span class="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Live Simulation</span>
        </div>
      </div>

      <!-- Core Telemetry -->
      <div class="flex items-center gap-6 px-5 border-r border-white/5">
        <div class="flex flex-col">
          <span class="text-[7px] text-slate-500 font-black uppercase tracking-tighter">Performance</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ state.fps() | number:'1.0-0' }}<span class="text-[8px] ml-0.5 text-slate-500">fps</span></span>
        </div>
        <div class="flex flex-col">
          <span class="text-[7px] text-slate-500 font-black uppercase tracking-tighter">Objects</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ ecs.entityCount() }}<span class="text-[8px] ml-0.5 text-slate-500">nodes</span></span>
        </div>
      </div>

      <!-- Engine Memory -->
      <div class="flex items-center gap-4 pl-5">
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between gap-4">
             <span class="text-[7px] text-slate-500 font-black uppercase tracking-tighter">Engine Memory</span>
             <span class="text-[7px] font-mono font-black text-indigo-400 uppercase">Tier_{{ memory.stats().t2 }}</span>
          </div>
          <div class="w-28 h-1 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
            <div class="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-700" [style.width.%]="memPercent().t0"></div>
            <div class="h-full bg-cyan-500 transition-all duration-700" [style.width.%]="memPercent().t1"></div>
            <div class="h-full bg-emerald-500 transition-all duration-700" [style.width.%]="memPercent().t2"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TelemetryComponent {
  public state = inject(EngineState2DService);
  public ecs = inject(ComponentStoreService);
  public memory = inject(MemorySystem2DService);

  memPercent = computed(() => {
    const s = this.memory.stats();
    const total = (s.t0 + s.t1 + s.t2) || 1;
    return {
      t0: (s.t0 / total) * 100,
      t1: (s.t1 / total) * 100,
      t2: (s.t2 / total) * 100
    };
  });
}