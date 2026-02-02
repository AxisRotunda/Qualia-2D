
import { Component, inject } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { ComponentStoreService } from '../../engine/ecs/component-store.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="flex items-center gap-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full shadow-2xl pointer-events-auto">
      <div class="flex items-center gap-2 pr-3 border-r border-white/10">
        <span class="w-2 h-2 rounded-full animate-pulse" 
          [class.bg-emerald-500]="state.mode() === 'play'" 
          [class.bg-amber-500]="state.mode() === 'edit'">
        </span>
        <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">{{ state.statusText() }}</span>
      </div>
      <div class="flex items-center gap-4 pl-3">
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] text-slate-500 font-mono">FPS</span>
          <span class="text-xs font-mono font-bold text-white">{{ state.fps() | number:'1.0-0' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] text-slate-500 font-mono">ENT</span>
          <span class="text-xs font-mono font-bold text-white">{{ ecs.entityCount() }}</span>
        </div>
      </div>
    </div>
  `
})
export class TelemetryComponent {
  public state = inject(EngineState2DService);
  public ecs = inject(ComponentStoreService);
}
