import { Component, inject, signal, output } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-menu-projects-tab',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <div class="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <!-- Header -->
        <header class="flex items-end justify-between border-b border-white/5 pb-8">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
               <div class="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">Hub_V2.0</div>
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Workspaces</h2>
          </div>
          <div class="text-right hidden md:block">
             <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Projects</div>
             <div class="text-2xl font-mono font-bold text-white">{{ projectService.projects().length }}</div>
          </div>
        </header>

        <!-- Project Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <!-- Create New Card (Ghost Style) -->
          <button (click)="isCreating.set(true)" 
            class="group relative h-64 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-indigo-400">
            <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7v14"/></svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em]">Initialize_New_Project</span>
          </button>

          <!-- Existing Projects -->
          @for (proj of projectService.projects(); track proj.id) {
            @let isActive = projectService.activeProjectId() === proj.id;
            <div 
              (click)="selectAndOpen(proj.id)"
              class="group relative h-64 p-8 rounded-[2rem] border bg-slate-900/40 backdrop-blur-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl"
              [class.border-emerald-500/40]="isActive"
              [class.bg-emerald-900/10]="isActive"
              [class.border-white/5]="!isActive"
              [class.hover:border-white/20]="!isActive">
              
              <!-- Active Indicator -->
              @if (isActive) {
                <div class="absolute top-0 inset-x-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                <div class="absolute top-6 right-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</div>
              }

              <!-- Content -->
              <div class="space-y-3 relative z-10">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white/60 mb-2"
                     [class.bg-emerald-500/20]="isActive"
                     [class.bg-white/5]="!isActive">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v2"/></svg>
                </div>
                <h3 class="text-2xl font-black text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{{ proj.name }}</h3>
                <p class="text-[10px] font-mono text-slate-500">ID: {{ proj.id.slice(0, 8) }}...</p>
              </div>

              <!-- Footer -->
              <div class="relative z-10 flex items-center justify-between border-t border-white/5 pt-4">
                 <span class="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                   Last Edit: {{ proj.created | date:'shortDate' }}
                 </span>
                 @if (!isActive) {
                   <button (click)="deleteProject($event, proj.id)" class="p-2 -mr-2 rounded-full hover:bg-rose-500/20 text-slate-600 hover:text-rose-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                   </button>
                 }
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- NEW PROJECT MODAL -->
    @if (isCreating()) {
      <div class="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
        <div class="w-full max-w-md bg-[#020617] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
          <header>
            <h3 class="text-2xl font-black text-white uppercase tracking-tight">New Project</h3>
          </header>
          <div class="space-y-2">
            <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2">Project Alias</label>
            <input #nameInput type="text" placeholder="My_New_Reality" 
              (keyup.enter)="create(nameInput.value)"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700">
          </div>
          <div class="flex gap-3">
            <button (click)="isCreating.set(false)" class="flex-1 py-4 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-colors">Abort</button>
            <button (click)="create(nameInput.value)" class="flex-1 py-4 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">Create</button>
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
export class MenuProjectsTabComponent {
  projectService = inject(ProjectService);
  isCreating = signal(false);
  openSceneBrowser = output<void>();

  create(name: string) {
    if (name.trim()) {
      this.projectService.createProject(name);
      this.isCreating.set(false);
      this.openSceneBrowser.emit();
    }
  }

  selectAndOpen(id: string) {
    this.projectService.selectProject(id);
    this.openSceneBrowser.emit();
  }

  deleteProject(e: Event, id: string) {
    e.stopPropagation();
    this.projectService.deleteProject(id);
  }
}