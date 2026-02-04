
import { Component, inject, output, signal, computed } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { ProjectService, ProjectScene } from '../../../services/project.service';
import { ScenePreset2D } from '../../../engine/scene.types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-menu-play-tab',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <div class="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
        
        <!-- Context Header -->
        <header class="flex items-start justify-between border-b border-white/5 pb-8">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-indigo-400">
               <span class="text-[9px] font-black uppercase tracking-widest">Active Context</span>
               <div class="h-px w-8 bg-indigo-500/20"></div>
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {{ project.activeProject()?.name || 'Unknown Project' }}
            </h2>
            <p class="text-slate-500 text-sm font-medium">Select a fragment to initialize simulation.</p>
          </div>
          
          <button (click)="back.emit()" class="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            Change Project
          </button>
        </header>

        <!-- Scene Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          <!-- ADD NEW SCENE -->
          <button (click)="isAddingScene.set(true)" 
            class="group relative h-48 md:h-64 p-8 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-indigo-400">
             <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7v14"/></svg>
             </div>
             <span class="text-[9px] font-black uppercase tracking-[0.2em]">Construct_Fragment</span>
          </button>

          <!-- LIST PROJECT SCENES -->
          @for (ps of project.activeProject()?.scenes; track ps.id) {
            @let resolved = project.resolveProjectScene(ps);
            @if (resolved) {
              <button (click)="select.emit(resolved)" 
                class="group relative h-48 md:h-64 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md text-left transition-all active:scale-[0.98] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-xl">
                
                <!-- Background Ambient -->
                <div class="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent z-0"></div>
                <div class="absolute top-0 right-0 p-40 bg-indigo-600/5 blur-[80px] rounded-full group-hover:bg-indigo-500/15 transition-all duration-700"></div>

                <!-- Top Row: Tags -->
                <div class="relative z-10 flex items-center justify-between">
                  <div class="flex gap-2">
                    <div class="px-2.5 py-1 bg-black/40 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-indigo-400">
                      {{ resolved.complexity }}
                    </div>
                    <div class="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                      {{ resolved.preferredTopology?.replace('top-down-', '') || 'Standard' }}
                    </div>
                  </div>
                  <button (click)="deleteScene($event, ps.id)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-500/20 hover:text-rose-500 text-slate-600 transition-colors z-20">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>

                <!-- Center: Title -->
                <div class="relative z-10 pl-2 border-l-2 border-white/10 group-hover:border-indigo-500 transition-colors">
                  <h3 class="text-3xl font-black text-white mb-2 leading-none tracking-tight">{{ ps.name }}</h3>
                  <p class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Template: {{ resolved.id === ps.templateId ? 'Standard' : ps.templateId }}
                  </p>
                </div>

                <!-- Bottom: Action -->
                <div class="relative z-10 flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ ps.created | date:'MMM d, HH:mm' }}</span>
                  <div class="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span class="text-[9px] font-black uppercase tracking-widest text-white">Load Fragment</span>
                    <div class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              </button>
            }
          }
        </div>
      </div>
    </div>

    <!-- NEW SCENE OVERLAY -->
    @if (isAddingScene()) {
      <div class="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
        <div class="w-full max-w-4xl bg-[#020617] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col gap-8 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
          
          <header class="flex items-center justify-between shrink-0">
             <div class="space-y-1">
               <h3 class="text-3xl font-black text-white uppercase tracking-tighter">New Fragment</h3>
               <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Select_Kernel_Template</p>
             </div>
             <button (click)="isAddingScene.set(false)" class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
             </button>
          </header>

          <div class="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
             @for (tpl of templates(); track tpl.id) {
               <button (click)="selectTemplate(tpl)" 
                 class="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 text-left hover:border-indigo-500/40 hover:bg-indigo-600/10 transition-all group flex flex-col justify-between h-40">
                 <div class="flex justify-between items-start">
                    <span class="px-2 py-1 rounded bg-black/40 text-[8px] font-black uppercase text-slate-500 tracking-widest">{{ tpl.complexity }}</span>
                    @if (selectedTemplate()?.id === tpl.id) {
                      <div class="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_10px_#6366f1]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" class="text-white"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                    }
                 </div>
                 <div class="space-y-1">
                    <h4 class="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-300 transition-colors">{{ tpl.name }}</h4>
                    <p class="text-[10px] text-slate-500 line-clamp-1">{{ tpl.description }}</p>
                 </div>
               </button>
             }
          </div>

          <div class="pt-6 border-t border-white/5 shrink-0 space-y-4">
             <div class="space-y-2">
               <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2">Fragment Alias</label>
               <input #sceneName type="text" placeholder="Sector_01" 
                 class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700">
             </div>
             <button (click)="confirmAdd(sceneName.value)" 
               [disabled]="!selectedTemplate()"
               class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed">
               Initialize Fragment
             </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
  `]
})
export class MenuPlayTabComponent {
  project = inject(ProjectService);
  engine = inject(Engine2DService);
  
  select = output<ScenePreset2D>();
  back = output<void>();

  isAddingScene = signal(false);
  templates = this.project.templateRegistry;
  selectedTemplate = signal<ScenePreset2D | null>(null);

  selectTemplate(tpl: ScenePreset2D) {
    this.selectedTemplate.set(tpl);
  }

  confirmAdd(name: string) {
    const tpl = this.selectedTemplate();
    if (tpl) {
      const finalName = name.trim() || `${tpl.name} Copy`;
      this.project.addSceneToProject(tpl.id, finalName);
      this.isAddingScene.set(false);
      this.selectedTemplate.set(null);
    }
  }

  deleteScene(e: Event, id: string) {
    e.stopPropagation();
    this.project.deleteScene(id);
  }
}
