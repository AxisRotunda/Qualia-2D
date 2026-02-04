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
        
        <!-- ENTITY PRIMARY -->
        <div class="bg-indigo-600/10 p-6 rounded-[2.5rem] border border-indigo-500/20 space-y-4 shadow-xl">
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  {{ id }}
                </div>
                <div class="flex flex-col">
                  <span class="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Object Identity</span>
                  <span class="text-white font-black tracking-tighter uppercase">Entity_{{ id.toString().padStart(3, '0') }}</span>
                </div>
              </div>
              <button (click)="engine.deleteEntity(id)" class="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6"/></svg>
              </button>
           </div>
           
           <div class="space-y-1">
             <label class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Display Name</label>
             <input type="text" [value]="engine.ecs.tags.get(id)?.name || ''" (input)="updateEntityName(id, $any($event.target).value)"
               class="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold tracking-tight outline-none focus:border-indigo-500/40 text-slate-200 transition-all placeholder:text-slate-700" placeholder="Unnamed Entity">
           </div>
        </div>

        <!-- TRANSFORM -->
        @if (engine.ecs.getTransform(id); as t) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><path d="m15 15 6 6m-6-6v6m0-6h6M9 9l-6-6m6 6V3m0 6H3m6 6-6 6m6-6v6m0-6H3m6-6 6-6m-6 6V3m0 6h6"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">Transform</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Spatial Placement</span>
                 </div>
               </div>
            </div>
            <div class="p-6 grid grid-cols-2 gap-3">
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Horizontal (X)</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.x | number:'1.3-3' }}</div>
               </div>
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Vertical (Y)</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.y | number:'1.3-3' }}</div>
               </div>
               <div class="col-span-2 p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Rotation Angle</span>
                  <div class="text-sm font-mono font-bold text-indigo-400">{{ t.rotation | number:'1.4-4' }}<span class="text-[10px] ml-1 opacity-50">rad</span></div>
               </div>
            </div>
          </div>
        }

        <!-- APPEARANCE -->
        @if (engine.ecs.getSprite(id); as s) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-400"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">Appearance</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Visual Core</span>
                 </div>
               </div>
            </div>
            <div class="p-6 space-y-6">
               <div class="grid grid-cols-2 gap-3">
                 <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">Size Width</label>
                    <input type="number" step="0.1" [value]="s.width" (input)="updateEntityWidth(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none">
                 </div>
                 <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">Size Height</label>
                    <input type="number" step="0.1" [value]="s.height" (input)="updateEntityHeight(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none">
                 </div>
               </div>
               
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Transparency</span>
                    <span class="text-[10px] font-mono text-white">{{ s.opacity * 100 | number:'1.0-0' }}%</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" [value]="s.opacity" (input)="s.opacity = +$any($event.target).value"
                    class="w-full accent-indigo-500">
               </div>

               <div class="space-y-3">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Material Color</span>
                  <div class="grid grid-cols-7 gap-2">
                    @for (c of ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff']; track c) {
                      <button (click)="engine.updateSpriteColor(id, c)" 
                        class="w-full aspect-square rounded-full border-2 transition-all active:scale-75 shadow-lg"
                        [style.background-color]="c"
                        [class.border-white]="s.color === c"
                        [class.border-transparent]="s.color !== c">
                      </button>
                    }
                  </div>
               </div>
            </div>
          </div>
        }

        <!-- PHYSICS -->
        @if (engine.ecs.rigidBodies.get(id); as rb) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-400"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M12 7v5l3 3"/></svg>
                 <div class="flex flex-col">
                   <span class="text-xs font-black uppercase text-white leading-tight">Physics Dynamics</span>
                   <span class="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Kinetic Solver</span>
                 </div>
               </div>
               <div class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[7px] font-black uppercase tracking-widest">
                 {{ rb.bodyType }}
               </div>
            </div>
            <div class="p-6 space-y-4">
               <div class="grid grid-cols-2 gap-3">
                  <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Linear Velocity</span>
                    <div class="text-xs font-mono font-bold text-white">{{ rb.handle.linvel().x | number:'1.1-1' }}, {{ rb.handle.linvel().y | number:'1.1-1' }}</div>
                  </div>
                  <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Angular Speed</span>
                    <div class="text-xs font-mono font-bold text-white">{{ rb.handle.angvel() | number:'1.2-2' }}</div>
                  </div>
               </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="flex-1 flex flex-col items-center justify-center h-full min-h-[400px]">
        <div class="w-16 h-16 border-2 border-dashed border-white/5 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-800"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">Awaiting Target</p>
        <p class="text-[8px] text-slate-900 uppercase font-bold tracking-widest mt-2">Select an entity to view properties</p>
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