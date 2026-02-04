import { Component, inject, signal, output } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { DatePipe } from '@angular/common';
import { DEMO_REGISTRY } from '../../../data/demos/index';

// Component Configuration
const PROJECTS_TAB_CONFIG = {
  MODAL: {
    DEFAULT_PLACEHOLDER: 'My_New_Reality',
  },
  VALIDATION: {
    MIN_NAME_LENGTH: 1,
  },
} as const;

/**
 * Projects Tab Component V2.0
 * Manages project/workspace creation, selection, and deletion.
 * Features:
 * - Active project management
 * - Demo template gallery
 * - Project creation modal
 */
@Component({
  selector: 'app-menu-projects-tab',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <div class="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <!-- Header -->
        <header class="flex items-end justify-between border-b border-white/5 pb-8">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
               <div class="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">Hub_V2.1</div>
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Workspaces</h2>
          </div>
          <div class="text-right hidden md:block">
             <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Projects</div>
             <div class="text-2xl font-mono font-bold text-white">{{ projectCount() }}</div>
          </div>
        </header>

        <!-- Active Projects -->
        <section class="space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Active_Sessions
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <!-- Create Blank -->
            <button (click)="openCreateModal()" 
              class="group relative h-64 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-indigo-400" aria-label="Create new blank project">
              <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7v14"/></svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Blank_Project</span>
            </button>

            <!-- Project Cards -->
            @for (proj of projectService.projects(); track proj.id) {
              @let isActive = isActiveProject(proj.id);
              <div 
                (click)="selectAndOpenProject(proj.id)"
                class="group relative h-64 p-8 rounded-[2rem] border bg-slate-900/40 backdrop-blur-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl"
                [class.border-emerald-500/40]="isActive"
                [class.bg-emerald-900/10]="isActive"
                [class.border-white/5]="!isActive"
                [class.hover:border-white/20]="!isActive">
                
                @if (isActive) {
                  <div class="absolute top-0 inset-x-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                  <div class="absolute top-6 right-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</div>
                }

                <div class="space-y-3 relative z-10">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white/60 mb-2"
                       [class.bg-emerald-500/20]="isActive"
                       [class.bg-white/5]="!isActive">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v2"/></svg>
                  </div>
                  <h3 class="text-2xl font-black text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{{ proj.name }}</h3>
                  <p class="text-[10px] font-mono text-slate-500">ID: {{ formatProjectId(proj.id) }}</p>
                </div>

                <div class="relative z-10 flex items-center justify-between border-t border-white/5 pt-4">
                   <span class="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                     {{ proj.created | date:'MMM d, y' }}
                   </span>
                   @if (!isActive) {
                     <button (click)="handleDeleteProject($event, proj.id)" class="p-2 -mr-2 rounded-full hover:bg-rose-500/20 text-slate-600 hover:text-rose-500 transition-colors" aria-label="Delete project">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0-1-1-2-2-2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                     </button>
                   }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Demo Templates -->
        <section class="space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span> Template_Gallery
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @for (demo of demos; track demo.id) {
              <div (click)="handleCreateFromDemo(demo.id)"
                class="group relative h-48 p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between overflow-hidden">
                
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div class="flex items-start justify-between relative z-10">
                   <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path [attr.d]="demo.thumbnailIcon"/></svg>
                   </div>
                   <div class="px-2 py-1 rounded bg-indigo-500/20 text-[8px] font-black uppercase text-indigo-300 tracking-widest">Demo</div>
                </div>

                <div class="relative z-10 space-y-1">
                   <h4 class="text-xl font-black text-white uppercase tracking-tight">{{ demo.name }}</h4>
                   <p class="text-[10px] text-slate-500 leading-relaxed">{{ demo.description }}</p>
                </div>

                <div class="relative z-10 pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors">
                   <span>Clone Template</span>
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </div>
              </div>
            }
          </div>
        </section>

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
            <input #nameInput type="text" 
              [placeholder]="createPlaceholder"
              (keyup.enter)="handleCreateProject(nameInput.value)"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700">
          </div>
          <div class="flex gap-3">
            <button (click)="closeCreateModal()" class="flex-1 py-4 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-colors">Abort</button>
            <button (click)="handleCreateProject(nameInput.value)" class="flex-1 py-4 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">Create</button>
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
  protected readonly projectService = inject(ProjectService);
  
  openSceneBrowser = output<void>();

  protected readonly isCreating = signal(false);
  protected readonly demos = DEMO_REGISTRY;
  protected readonly createPlaceholder = PROJECTS_TAB_CONFIG.MODAL.DEFAULT_PLACEHOLDER;

  /**
   * Computed: Total project count
   */
  protected projectCount = () => this.projectService.projects().length;

  /**
   * Checks if project is currently active
   */
  protected isActiveProject(id: string): boolean {
    return this.projectService.activeProjectId() === id;
  }

  /**
   * Formats project ID for display (first 8 characters)
   */
  protected formatProjectId(id: string): string {
    return `${id.slice(0, 8)}...`;
  }

  /**
   * Modal controls
   */
  protected openCreateModal(): void {
    this.isCreating.set(true);
  }

  protected closeCreateModal(): void {
    this.isCreating.set(false);
  }

  /**
   * Creates new blank project with validation
   */
  protected handleCreateProject(name: string): void {
    const trimmedName = name.trim();
    
    if (trimmedName.length >= PROJECTS_TAB_CONFIG.VALIDATION.MIN_NAME_LENGTH) {
      this.projectService.createProject(trimmedName);
      this.closeCreateModal();
      this.openSceneBrowser.emit();
    }
  }

  /**
   * Creates project from demo template
   */
  protected handleCreateFromDemo(id: string): void {
    this.projectService.createProjectFromDemo(id);
    this.openSceneBrowser.emit();
  }

  /**
   * Selects project and navigates to scene browser
   */
  protected selectAndOpenProject(id: string): void {
    this.projectService.selectProject(id);
    this.openSceneBrowser.emit();
  }

  /**
   * Deletes project with event propagation stop
   */
  protected handleDeleteProject(event: Event, id: string): void {
    event.stopPropagation();
    this.projectService.deleteProject(id);
  }
}
