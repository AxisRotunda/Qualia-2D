import { Component, inject } from '@angular/core';
import { CommandRegistryService } from '../../../services/command-registry.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  template: `
    <div class="w-56 pointer-events-none hidden md:block transition-all duration-500" 
         [class.opacity-20]="state.mode() === 'play'">
      <div class="bg-slate-950/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 space-y-2 pointer-events-auto">
        <div class="space-y-1.5">
          @for (log of commands.commandLog(); track $index) {
            <div class="text-[10px] font-mono text-slate-400 truncate animate-in fade-in slide-in-from-left-2 duration-300">
              <span class="text-indigo-500/50 mr-1">›</span>{{ log }}
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LogViewerComponent {
  commands = inject(CommandRegistryService);
  state = inject(EngineState2DService);
}
