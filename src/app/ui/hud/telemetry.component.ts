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
    <div class="flex items-center gap-1 bg-slate-950/60 backdrop-blur-3xl border border-white/10 px-5 py-2 rounded-full shadow-2xl pointer-events-auto">
      <!-- Simulation Status -->
      <div class="flex items-center gap-2.5 pr-4 border-r border-white/5">
        <span class="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
          [class.bg-emerald-500]="state.mode() === 'play'" 
          [class.bg-amber-500]="state.mode() === 'edit'">
        </span>
        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/90">{{ state.statusText() }}</span>
      </div>

      <!-- Engine Metrics -->
      <div class="flex items-center gap-5 px-4 border-r border-white/5">
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-slate-500 font-black tracking-widest uppercase">Fps</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ state.fps() | number:'1.0-0' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-slate-500 font-black tracking-widest uppercase">Ent</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ ecs.entityCount() }}</span>
        </div>
      </div>

      <!-- Cognitive State (Memory) -->
      <div class="flex items-center gap-3 pl-4">
        <span class="text-[8px] text-slate-500 font-black tracking-widest uppercase">Mem</span>
        <div class="flex items-center gap-1.5">
          <div class="flex flex-col gap-0.5">
            <div class="w-24 h-1 bg-white/5 rounded-full overflow-hidden flex">
              <div class="h-full bg-indigo-500 transition-all duration-500" [style.width.%]="memPercent().t0"></div>
              <div class="h-full bg-cyan-500 transition-all duration-500" [style.width.%]="memPercent().t1"></div>
              <div class="h-full bg-emerald-500 transition-all duration-500" [style.width.%]="memPercent().t2"></div>
            </div>
          </div>
          <span class="text-[8px] font-mono font-bold text-slate-400">T:{{ memory.stats().t2 }}</span>
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