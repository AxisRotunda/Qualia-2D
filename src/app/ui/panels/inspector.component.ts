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
                  <span class="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Entity_Handle</span>
                  <span class="text-white font-black tracking-tighter">HEX_{{ id.toString(16).toUpperCase() }}</span>
                </div>
              </div>
              <button (click)="engine.deleteEntity(id)" class="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6"/></svg>
              </button>
           </div>
           
           <div class="space-y-1">
             <label class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Identifier</label>
             <input type="text" [value]="engine.ecs.tags.get(id)?.name || ''" (input)="updateEntityName(id, $any($event.target).value)"
               class="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold tracking-tight outline-none focus:border-indigo-500/40 text-slate-200 transition-all placeholder:text-slate-700" placeholder="Unnamed_Entity">
           </div>
        </div>

        <!-- TRANSFORM 2D -->
        @if (engine.ecs.getTransform(id); as t) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><path d="m15 15 6 6m-6-6v6m0-6h6M9 9l-6-6m6 6V3m0 6H3m6 6-6 6m6-6v6m0-6H3m6-6 6-6m-6 6V3m0 6h6"/></svg>
                 <span class="text-[9px] font-black uppercase tracking-widest text-white">Spatial_Matrix</span>
               </div>
            </div>
            <div class="p-6 grid grid-cols-2 gap-3">
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">X_Coord</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.x | number:'1.3-3' }}</div>
               </div>
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Y_Coord</span>
                  <div class="text-sm font-mono font-bold text-white">{{ t.y | number:'1.3-3' }}</div>
               </div>
               <div class="col-span-2 p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Rotation_Rad</span>
                  <div class="text-sm font-mono font-bold text-indigo-400">{{ t.rotation | number:'1.4-4' }}</div>
               </div>
            </div>
          </div>
        }

        <!-- VISUAL_CORE -->
        @if (engine.ecs.getSprite(id); as s) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-400"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                 <span class="text-[9px] font-black uppercase tracking-widest text-white">Visual_Output</span>
               </div>
            </div>
            <div class="p-6 space-y-6">
               <div class="grid grid-cols-2 gap-3">
                 <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">W_Units</label>
                    <input type="number" step="0.1" [value]="s.width" (input)="updateEntityWidth(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none">
                 </div>
                 <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <label class="block text-[8px] text-slate-500 uppercase font-black tracking-tighter">H_Units</label>
                    <input type="number" step="0.1" [value]="s.height" (input)="updateEntityHeight(id, $any($event.target).value)" 
                      class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none">
                 </div>
               </div>
               
               <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Opacity_Alpha</span>
                    <span class="text-[10px] font-mono text-white">{{ s.opacity | number:'1.2-2' }}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" [value]="s.opacity" (input)="s.opacity = +$any($event.target).value"
                    class="w-full accent-indigo-500">
               </div>

               <div class="space-y-3">
                  <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest px-1">Chromatic_Key</span>
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

        <!-- PHYSICS_RIGID_BODY -->
        @if (engine.ecs.rigidBodies.get(id); as rb) {
          <div class="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div class="px-6 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-400"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M12 7v5l3 3"/></svg>
                 <span class="text-[9px] font-black uppercase tracking-widest text-white">Kinetic_Engine</span>
               </div>
               <div class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[7px] font-black uppercase tracking-widest">
                 {{ rb.bodyType }}
               </div>
            </div>
            <div class="p-6 space-y-4">
               <div class="grid grid-cols-2 gap-3">
                  <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">L_Velocity</span>
                    <div class="text-xs font-mono font-bold text-white">{{ rb.handle.linvel().x | number:'1.1-1' }}, {{ rb.handle.linvel().y | number:'1.1-1' }}</div>
                  </div>
                  <div class="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                    <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">A_Velocity</span>
                    <div class="text-xs font-mono font-bold text-white">{{ rb.handle.angvel() | number:'1.2-2' }}</div>
                  </div>
               </div>
            </div>
          </div>
        }

        <!-- FIELD_DYNAMICS -->
        @if (engine.ecs.getForceField(id); as f) {
          <div class="bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/20 overflow-hidden">
            <div class="px-6 py-5 bg-indigo-500/10 flex items-center justify-between border-b border-indigo-500/10">
               <div class="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-indigo-400"><circle cx="12" cy="12" r="10"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
                 <span class="text-[9px] font-black uppercase tracking-widest text-white">Singularity_Control</span>
               </div>
               <button (click)="f.active = !f.active" 
                  class="w-10 h-6 rounded-full relative transition-colors"
                  [class.bg-indigo-600]="f.active" [class.bg-slate-800]="!f.active">
                  <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform" [class.translate-x-4]="f.active"></div>
               </button>
            </div>
            <div class="p-6 space-y-6">
               <div class="space-y-3">
                  <div class="flex justify-between text-[8px] uppercase font-black text-slate-500 tracking-widest">
                    <span>Intensity_Flux</span>
                    <span class="text-white">{{ f.strength | number:'1.0-0' }}</span>
                  </div>
                  <input type="range" min="-100" max="100" step="1" [value]="f.strength" (input)="f.strength = +$any($event.target).value"
                    class="w-full accent-indigo-500">
               </div>
               <div class="space-y-3">
                  <div class="flex justify-between text-[8px] uppercase font-black text-slate-500 tracking-widest">
                    <span>Influence_Radius</span>
                    <span class="text-white">{{ f.radius | number:'1.1-1' }}</span>
                  </div>
                  <input type="range" min="1" max="50" step="0.5" [value]="f.radius" (input)="f.radius = +$any($event.target).value"
                    class="w-full accent-indigo-500">
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
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">Observation_Offline</p>
        <p class="text-[8px] text-slate-900 uppercase font-bold tracking-widest mt-2">Select a node to initialize inspector</p>
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