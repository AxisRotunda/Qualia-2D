import { Component, input, output, signal, computed } from '@angular/core';
import { ControllerTopology } from '../../../services/engine-state-2d.service';
import { ScenePreset2D } from '../../../engine/scene.types';
import { DecimalPipe } from '@angular/common';

// Component Configuration
const MODAL_CONFIG = {
  ANIMATION: {
    GLOW_BLUR: '120px',
    BACKDROP_BLUR: 'backdrop-blur-2xl',
    FADE_DURATION: 300,
    ZOOM_DURATION: 300,
  },
  TOPOLOGY_ICONS: {
    platformer: 'M12 19V5M5 12l7-7 7 7',
    'top-down-action': 'circle:M12 12 10/path:m4.93 4.93 14.14 14.14',
    'top-down-rpg': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
  TOPOLOGY_COLORS: {
    platformer: 'emerald',
    'top-down-action': 'rose',
    'top-down-rpg': 'indigo',
  },
  COMPLEXITY_MAPPING: {
    low: 1,
    medium: 3,
    high: 4,
    'stress-test': 5,
  } as const,
  DEFAULTS: {
    TOPOLOGY: 'platformer' as ControllerTopology,
    GRAVITY: -9.81,
    ENV_TYPE: 'Standard',
    COMPLEXITY_SCORE: 2,
  },
} as const;

/**
 * Launch Modal Component V2.0
 * Displays scene configuration details and initializes simulation with selected topology.
 * Features:
 * - Topology-derived visual theming
 * - Physics configuration preview
 * - Complexity visualization
 */
@Component({
  selector: 'app-menu-launch-modal',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div (click)="cancel.emit()" class="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div (click)="$event.stopPropagation()" class="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[3.5rem] p-10 md:p-16 animate-in zoom-in-95 duration-300 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <!-- Ambient Glow (Derived from Topology) -->
          <div class="absolute -top-32 -right-32 w-80 h-80 blur-[120px] rounded-full pointer-events-none opacity-40"
               [class]="topologyGlowClass()">
          </div>

          <!-- Header -->
          <header class="relative z-10 flex items-start justify-between mb-10">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                   <div class="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                     Fragment_Manifest
                   </div>
                   <div class="h-px w-8 bg-white/10"></div>
                </div>
                <h2 class="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter">{{ scene().name }}</h2>
              </div>
              <button (click)="cancel.emit()" class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 6-12 12m0-12 12 12"/></svg>
              </button>
          </header>

          <div class="relative z-10 space-y-10">
              
              <!-- System Diagnostics Card -->
              <div class="bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 space-y-6">
                 
                 <!-- Row 1: Topology & Complexity -->
                 <div class="grid grid-cols-2 gap-8 border-b border-white/5 pb-6">
                    <div class="space-y-2">
                       <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Kernel_Mode</span>
                       <div class="flex items-center gap-3 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" [class]="topologyIconColorClass()">
                            <path [attr.d]="topologyIconPath()"></path>
                          </svg>
                          <span class="text-lg font-black uppercase tracking-tight">{{ topologyDisplay() }}</span>
                       </div>
                    </div>
                    
                    <div class="space-y-2">
                       <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Load_Complexity</span>
                       <div class="flex items-center gap-2">
                          @for (i of complexityIndicators; track i) {
                             <div class="w-1.5 h-6 rounded-full transition-colors"
                                  [class.bg-indigo-500]="i <= complexityScore()"
                                  [class.bg-white/5]="i > complexityScore()">
                             </div>
                          }
                       </div>
                    </div>
                 </div>

                 <!-- Row 2: Physics Parameters -->
                 <div class="grid grid-cols-2 gap-8">
                    <div class="space-y-1">
                       <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Gravity_Y</span>
                       <div class="text-xl font-mono font-bold text-white">{{ gravityY() | number:'1.2-2' }} <span class="text-[10px] text-slate-600">m/s²</span></div>
                    </div>
                    <div class="space-y-1">
                       <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Environment</span>
                       <div class="text-xl font-mono font-bold text-white uppercase">{{ environmentType() }}</div>
                    </div>
                 </div>

              </div>

              <!-- Action -->
              <button (click)="launch.emit(topology())" class="group w-full py-6 bg-white hover:bg-indigo-500 text-black hover:text-white rounded-[2rem] transition-all shadow-[0_0_60px_-10px_rgba(255,255,255,0.2)] active:scale-[0.98] flex items-center justify-center gap-4">
                <span class="text-xs font-black uppercase tracking-[0.3em]">Initialize_Simulation</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </button>
          </div>
        </div>
    </div>
  `
})
export class MenuLaunchModalComponent {
  scene = input.required<ScenePreset2D>();
  launch = output<ControllerTopology>();
  cancel = output<void>();

  // Configuration data
  protected readonly complexityIndicators = [1, 2, 3, 4, 5];

  /**
   * Derives topology from scene definition with fallback
   */
  topology = computed(() => 
    this.scene().preferredTopology || MODAL_CONFIG.DEFAULTS.TOPOLOGY
  );
  
  /**
   * Extracts gravity configuration with standard earth gravity fallback
   */
  gravityY = computed(() => 
    this.scene().config?.physics?.gravity.y ?? MODAL_CONFIG.DEFAULTS.GRAVITY
  );

  /**
   * Extracts environment type with fallback
   */
  environmentType = computed(() => 
    this.scene().config?.env?.type || MODAL_CONFIG.DEFAULTS.ENV_TYPE
  );

  /**
   * Maps complexity level to visual score (1-5 scale)
   */
  complexityScore = computed(() => {
    const complexity = this.scene().complexity;
    return MODAL_CONFIG.COMPLEXITY_MAPPING[complexity] ?? MODAL_CONFIG.DEFAULTS.COMPLEXITY_SCORE;
  });

  /**
   * Returns formatted topology display text
   */
  topologyDisplay = computed(() => 
    this.topology().replace(/-/g, ' ')
  );

  /**
   * Returns topology-specific glow color class
   */
  topologyGlowClass = computed(() => {
    const topology = this.topology();
    const colorMap: Record<string, string> = {
      'platformer': 'bg-emerald-500',
      'top-down-action': 'bg-rose-500',
      'top-down-rpg': 'bg-indigo-500',
    };
    return colorMap[topology] || 'bg-indigo-500';
  });

  /**
   * Returns topology-specific icon color class
   */
  topologyIconColorClass = computed(() => {
    const topology = this.topology();
    const colorMap: Record<string, string> = {
      'platformer': 'text-emerald-400',
      'top-down-action': 'text-rose-400',
      'top-down-rpg': 'text-indigo-400',
    };
    return colorMap[topology] || 'text-indigo-400';
  });

  /**
   * Returns topology-specific icon SVG path
   */
  topologyIconPath = computed(() => {
    const topology = this.topology();
    const pathMap: Record<string, string> = {
      'platformer': 'M12 19V5M5 12l7-7 7 7',
      'top-down-action': 'm4.93 4.93 14.14 14.14',
      'top-down-rpg': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    };
    return pathMap[topology] || pathMap['top-down-rpg'];
  });
}
