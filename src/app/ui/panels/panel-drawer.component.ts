
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-panel-drawer',
  standalone: true,
  template: `
    <aside 
      class="fixed top-0 bottom-0 w-80 md:w-96 bg-slate-950/80 backdrop-blur-3xl border-white/10 z-[70] transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] flex flex-col shadow-2xl"
      [class.left-0]="side() === 'left'"
      [class.right-0]="side() === 'right'"
      [class.border-r]="side() === 'left'"
      [class.border-l]="side() === 'right'"
      [class.-translate-x-full]="side() === 'left' && !visible()"
      [class.translate-x-full]="side() === 'right' && !visible()">
      
      <div class="p-8 flex-1 flex flex-col overflow-hidden">
        <header class="flex items-center justify-between mb-10">
          <h2 class="text-white font-black text-xl uppercase tracking-tighter">
            {{ title() }}
          </h2>
          <button (click)="close.emit()" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
          </button>
        </header>
        
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
          <ng-content></ng-content>
        </div>
      </div>
    </aside>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 2px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
    </style>
  `
})
export class PanelDrawerComponent {
  title = input.required<string>();
  side = input<'left' | 'right'>('left');
  visible = input<boolean>(false);
  close = output<void>();
}
