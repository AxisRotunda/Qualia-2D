import { Component, inject } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @if (state.selectedEntityId(); as id) {
      <div class="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <!-- ENTITY HEADER -->
        <div class="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 space-y-4">
           <div class="flex items-center justify-between">
              <div class="text-white font-black text-2xl tracking-tighter">#{{ id }}</div>
              <div class="flex items-center gap-2">
                @if (engine.ecs.rigidBodies.has(id)) {
                  <span class="text-[8px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md uppercase font-black tracking-widest">Physics</span>
                }
                @if (engine.ecs.forceFields.has(id)) {
                  <span class="text-[8px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md uppercase font-black tracking-widest">Force</span>
                }
              </div>
           </div>
           <input type="text" [value]="engine.ecs.tags.get(id)?.name || ''" (input)="updateEntityName(id, $any($event.target).value)"
             class="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold tracking-tight outline-none focus:border-indigo-500/40 text-slate-200 transition-all">
        </div>

        <!-- TRANSFORM COMPONENT -->
        @if (engine.ecs.getTransform(id); as t) {
          <div class="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
            <div class="px-5 py-4 bg-white/5 flex items-center gap-3 border-b border-white/5">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><path d="m15 15 6 6m-6-6v6m0-6h6M9 9l-6-6m6 6V3m0 6H3m6 6-6 6m6-6v6m0-6H3m6-6 6-6m-6 6V3m0 6h6"/></svg>
               <span class="text-[9px] font-black uppercase tracking-widest text-white/80">Transform 2D</span>
            </div>
            <div class="p-5 grid grid-cols-2 gap-3">
               <div class="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Pos X</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.x | number:'1.2-2' }}</div>
               </div>
               <div class="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Pos Y</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.y | number:'1.2-2' }}</div>
               </div>
            </div>
          </div>
        }

        <!-- VISUALS -->
        @if (engine.ecs.getSprite(id); as s) {
          <div class="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
            <div class="px-5 py-4 bg-white/5 flex items-center gap-3 border-b border-white/5">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-400"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               <span class="text-[9px] font-black uppercase tracking-widest text-white/80">Visual Core</span>
            </div>
            <div class="p-5 space-y-4">
               <div class="grid grid-cols-2 gap-3">
                 <div class="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">Width</label>
                    <input type="number" step="0.1" [value]="s.width" (input)="updateEntityWidth(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none focus:ring-0">
                 </div>
                 <div class="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">Height</label>
                    <input type="number" step="0.1" [value]="s.height" (input)="updateEntityHeight(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none focus:ring-0">
                 </div>
               </div>
               <div class="grid grid-cols-7 gap-2">
                  @for (c of ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff']; track c) {
                    <button (click)="engine.updateSpriteColor(id, c)" 
                      class="w-full aspect-square rounded-full border-2 transition-all active:scale-75"
                      [style.background-color]="c"
                      [class.border-white]="s.color === c"
                      [class.border-transparent]="s.color !== c">
                    </button>
                  }
               </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="flex-1 flex flex-col items-center justify-center text-slate-800 h-64">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Awaiting Selection</p>
      </div>
    }
  `
})
export class InspectorComponent {
  public engine = inject(Engine2DService);
  public state = inject(EngineState2DService);

  updateEntityWidth(id: number, val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const s = this.engine.ecs.getSprite(id);
      if (s) this.engine.updateEntitySize(id, num, s.height);
    }
  }

  updateEntityHeight(id: number, val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const s = this.engine.ecs.getSprite(id);
      if (s) this.engine.updateEntitySize(id, s.width, num);
    }
  }

  updateEntityName(id: number, val: string) {
    this.engine.updateEntityName(id, val);
  }
}