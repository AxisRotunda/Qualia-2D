import { Component, inject } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { ComponentStoreService } from '../../../engine/ecs/component-store.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="flex items-center gap-1 bg-slate-950/60 backdrop-blur-3xl border border-white/10 px-5 py-2 rounded-full shadow-2xl pointer-events-auto">
      <div class="flex items-center gap-2.5 pr-4 border-r border-white/5">
        <span class="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
          [class.bg-emerald-500]="state.mode() === 'play'" 
          [class.bg-amber-500]="state.mode() === 'edit'">
        </span>
        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/90">{{ state.statusText() }}</span>
      </div>
      <div class="flex items-center gap-5 pl-4">
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-slate-500 font-black tracking-widest uppercase">Fps</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ state.fps() | number:'1.0-0' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-slate-500 font-black tracking-widest uppercase">Ent</span>
          <span class="text-xs font-mono font-bold text-white tracking-tighter">{{ ecs.entityCount() }}</span>
        </div>
      </div>
    </div>
  `
})
export class TelemetryComponent {
  public state = inject(EngineState2DService);
  public ecs = inject(ComponentStoreService);
}