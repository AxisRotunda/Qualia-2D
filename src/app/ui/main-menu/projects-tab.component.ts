import { Component, inject, signal } from '@angular/core';
import { ProjectService, ProjectData } from '../../../services/project.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-menu-projects-tab',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto pt-36 pb-24 px-6 md:px-12 animate-in fade-in slide-in-from-left-8 duration-700">
        
        <header class="mb-16 flex items-end justify-between">
          <div class="space-y-4">
            <h2 class="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
              Project<br/><span class="text-indigo-500">Workspace</span>
            </h2>
            <p class="text-slate-500 text-sm md:text-lg font-medium tracking-tight max-w-xl">
              Manage your collection of simulated realities. Projects act as persistent containers for scenes and assets.
            </p>
          </div>
          <button (click)="isCreating.set(true)" 
            class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-[0_12px_24px_-8px_rgba(99,102,241,0.5)] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14m-7-7v14"/></svg>
            Construct_Project
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (proj of projectService.projects(); track proj.id) {
            @let isActive = projectService.activeProjectId() === proj.id;
            <div 
              class="group relative p-8 md:p-10 rounded-[2.5rem] border transition-all overflow-hidden flex flex-col gap-10 shadow-2xl"
              [class.bg-indigo-600/10]="isActive"
              [class.border-indigo-500/40]="isActive"
              [class.bg-slate-900/40]="!isActive"
              [class.border-white/5]="!isActive">
              
              <div class="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700"></div>

              <div class="relative z-10 flex items-start justify-between">
                <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-indigo-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v2"/></svg>
                </div>
                @if (!isActive) {
                  <button (click)="projectService.deleteProject(proj.id)" class="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6"/></svg>
                  </button>
                }
              </div>

              <div class="relative z-10 space-y-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">{{ proj.name }}</h3>
                  @if (isActive) {
                    <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  }
                </div>
                <div class="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>v{{ proj.version }}</span>
                  <span class="w-1 h-1 rounded-full bg-white/10"></span>
                  <span>{{ proj.created | date:'MMM yyyy' }}</span>
                </div>
              </div>

              <div class="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
                <button (click)="projectService.selectProject(proj.id)" 
                  class="flex items-center gap-3 group/btn text-[10px] font-black uppercase tracking-widest transition-colors"
                  [class.text-indigo-400]="isActive"
                  [class.text-slate-500]="!isActive"
                  [class.hover:text-white]="!isActive">
                  {{ isActive ? 'Workspace_Active' : 'Initialize_Session' }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="transition-transform group-hover/btn:translate-x-1">
                    <path d="M9 18 15 12 9 6"></path>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- NEW PROJECT MODAL -->
    @if (isCreating()) {
      <div class="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div class="w-full max-w-lg bg-[#020617] border border-white/10 rounded-[3rem] p-10 md:p-14 animate-in zoom-in-95 duration-300 shadow-2xl space-y-10">
          <header class="space-y-2">
            <h3 class="text-white font-black text-3xl uppercase tracking-tighter">New Project</h3>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Define your simulated workspace</p>
          </header>

          <div class="space-y-4">
            <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Project_Alias</label>
            <input #nameInput type="text" placeholder="Matrix_Fragment_01" 
              class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold text-white outline-none focus:border-indigo-500/50 transition-all">
          </div>

          <div class="flex items-center gap-4">
            <button (click)="isCreating.set(false)" class="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Cancel</button>
            <button (click)="create(nameInput.value)" class="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all">Construct_Reality</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  `]
})
export class MenuProjectsTabComponent {
  projectService = inject(ProjectService);
  isCreating = signal(false);

  create(name: string) {
    if (name.trim()) {
      this.projectService.createProject(name);
      this.isCreating.set(false);
    }
  }
}