import { Component, input, output, signal, OnInit } from '@angular/core';
import { ControllerTopology } from '../../../services/engine-state-2d.service';
import { ScenePreset2D } from '../../../engine/scene.types';

@Component({
  selector: 'app-menu-launch-modal',
  standalone: true,
  template: `
    <div (click)="cancel.emit()" class="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div (click)="$event.stopPropagation()" class="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[3.5rem] p-10 md:p-16 animate-in zoom-in-95 duration-300 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <header class="relative z-10 flex items-start justify-between mb-12">
              <div class="space-y-3">
                <div class="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em]">Initialize_Reality_Fragment</div>
                <h2 class="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter">{{ scene().name }}</h2>
              </div>
              <button (click)="cancel.emit()" class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
              </button>
          </header>

          <div class="relative z-10 space-y-12">
              <div class="space-y-6">
                <label class="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em] px-2 block">Control_Topology</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    @for (t of topologies; track t) {
                      <button (click)="selectedTopology.set(t)" 
                          class="p-5 rounded-3xl border text-center transition-all relative overflow-hidden active:scale-95"
                          [class.bg-indigo-600]="selectedTopology() === t"
                          [class.border-indigo-400/50]="selectedTopology() === t"
                          [class.bg-white/5]="selectedTopology() !== t"
                          [class.border-white/5]="selectedTopology() !== t"
                          [class.hover:bg-white/10]="selectedTopology() !== t">
                          <div class="text-[10px] font-black uppercase tracking-widest text-white">{{ t.replace('-', ' ') }}</div>
                      </button>
                    }
                </div>
              </div>

              <button (click)="launch.emit(selectedTopology())" class="w-full py-8 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_60px_-10px_rgba(255,255,255,0.3)]">
                Activate Reality Stream
              </button>
          </div>
        </div>
    </div>
  `
})
export class MenuLaunchModalComponent implements OnInit {
  scene = input.required<ScenePreset2D>();
  topologies: ControllerTopology[] = ['platformer', 'top-down-action', 'top-down-rpg'];
  
  selectedTopology = signal<ControllerTopology>('platformer');
  
  launch = output<ControllerTopology>();
  cancel = output<void>();

  ngOnInit() {
    // [REPAIR_INPUT_REQ]: Signal inputs are only available after the constructor.
    // Sync initial topology preference from the required scene input.
    const initial = this.scene().preferredTopology;
    if (initial) {
      this.selectedTopology.set(initial);
    }
  }
}