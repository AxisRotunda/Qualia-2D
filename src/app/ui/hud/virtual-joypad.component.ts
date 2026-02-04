import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { EngineState2DService, ControllerTopology } from '../../../services/engine-state-2d.service';
import { Input2DService } from '../../../services/input-2d.service';

interface StickState {
  active: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  identifier: number | null;
}

interface Vector2D {
  x: number;
  y: number;
}

type RightControlType = 'stick' | 'button-jump' | 'button-interact';

/**
 * Industry Standard Mobile Controls V2.1
 * [UX]: Context-aware layout shifting based on Topology (Platformer vs Top-Down).
 * [ENHANCED]: Dead zone, haptic feedback, improved type safety
 */
@Component({
  selector: 'app-virtual-joypad',
  standalone: true,
  template: `
    @if (state.mode() === 'play') {
      <div class="fixed inset-0 z-30 touch-none select-none pointer-events-none overflow-hidden">
        
        <!-- === LEFT ZONE: MOVEMENT (ALWAYS ACTIVE) === -->
        <!-- Fixed Zone for reliability: Bottom Left 40% -->
        <div class="absolute bottom-0 left-0 w-[40%] h-[50%] pointer-events-auto"
             (touchstart)="onZoneStart($event, 'left')"
             (touchmove)="onZoneMove($event)"
             (touchend)="onZoneEnd($event, 'left')"
             (touchcancel)="onZoneEnd($event, 'left')">
        </div>

        <!-- === RIGHT ZONE: CONTEXT AWARE === -->
        @switch (rightControlType()) {
          
          <!-- TYPE: TWIN STICK (Shooter) -->
          @case ('stick') {
            <div class="absolute bottom-0 right-0 w-[40%] h-[50%] pointer-events-auto"
                 (touchstart)="onZoneStart($event, 'right')"
                 (touchmove)="onZoneMove($event)"
                 (touchend)="onZoneEnd($event, 'right')"
                 (touchcancel)="onZoneEnd($event, 'right')">
            </div>
          }

          <!-- TYPE: PLATFORMER (Jump Button) -->
          @case ('button-jump') {
            <div class="absolute bottom-12 right-8 pointer-events-auto animate-in zoom-in-95 duration-300">
               <button 
                 (touchstart)="onAction($event, true)" 
                 (touchend)="onAction($event, false)"
                 (touchcancel)="onAction($event, false)"
                 class="w-24 h-24 rounded-full bg-emerald-600/40 backdrop-blur-3xl border-2 border-emerald-500/50 active:bg-emerald-500 active:scale-90 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center group relative overflow-hidden">
                 
                 <!-- Inner Glow -->
                 <div class="absolute inset-2 rounded-full border border-emerald-400/30"></div>
                 
                 <div class="flex flex-col items-center relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-white group-active:-translate-y-1 transition-transform">
                     <path d="m18 15-6-6-6 6"/>
                   </svg>
                   <span class="text-[9px] font-black text-white/90 tracking-[0.2em] mt-1">JUMP</span>
                 </div>
               </button>
            </div>
          }

          <!-- TYPE: RPG (Interact Button) -->
          @case ('button-interact') {
            <div class="absolute bottom-12 right-8 pointer-events-auto animate-in zoom-in-95 duration-300">
               <button 
                 (touchstart)="onAction($event, true)" 
                 (touchend)="onAction($event, false)"
                 (touchcancel)="onAction($event, false)"
                 class="w-24 h-24 rounded-full bg-indigo-600/40 backdrop-blur-3xl border-2 border-indigo-500/50 active:bg-indigo-500 active:scale-90 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] flex items-center justify-center group relative overflow-hidden">
                 
                 <div class="absolute inset-2 rounded-full border border-indigo-400/30"></div>

                 <div class="flex flex-col items-center relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-white group-active:scale-110 transition-transform">
                     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                   </svg>
                   <span class="text-[9px] font-black text-white/90 tracking-[0.2em] mt-1">ACT</span>
                 </div>
               </button>
            </div>
          }
        }

        <!-- === VISUALS: STICK FEEDBACK === -->
        
        <!-- Left Stick Puck -->
        <div class="absolute w-32 h-32 -ml-16 -mt-16 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center transition-opacity duration-150 ease-out will-change-transform pointer-events-none"
             [style.left.px]="leftStick().originX"
             [style.top.px]="leftStick().originY"
             [class.opacity-0]="!leftStick().active"
             [class.opacity-100]="leftStick().active">
             <div class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.6)] border border-white/20"
                [style.transform]="'translate(' + leftPuckTransform().x + 'px, ' + leftPuckTransform().y + 'px)'">
                <div class="absolute inset-3 border-2 border-white/10 rounded-full"></div>
             </div>
        </div>

        <!-- Right Stick Puck (Only active in Twin-Stick mode) -->
        <div class="absolute w-32 h-32 -ml-16 -mt-16 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center transition-opacity duration-150 ease-out will-change-transform pointer-events-none"
             [style.left.px]="rightStick().originX"
             [style.top.px]="rightStick().originY"
             [class.opacity-0]="!rightStick().active"
             [class.opacity-100]="rightStick().active">
             <div class="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-white/20"
                [style.transform]="'translate(' + rightPuckTransform().x + 'px, ' + rightPuckTransform().y + 'px)'">
                <div class="absolute inset-3 border-2 border-white/10 rounded-full"></div>
             </div>
        </div>

      </div>
    }
  `
})
export class VirtualJoypadComponent {
  private readonly state = inject(EngineState2DService);
  private readonly input = inject(Input2DService);
  private readonly destroyRef = inject(DestroyRef);

  // Configuration constants (industry standard values)
  private readonly JOYSTICK_MAX_DISTANCE = 40;
  private readonly DEAD_ZONE_THRESHOLD = 0.15;
  private readonly SENSITIVITY = 1.0;

  readonly leftStick = signal<StickState>({ 
    active: false, 
    originX: 0, 
    originY: 0, 
    currentX: 0, 
    currentY: 0, 
    identifier: null 
  });

  readonly rightStick = signal<StickState>({ 
    active: false, 
    originX: 0, 
    originY: 0, 
    currentX: 0, 
    currentY: 0, 
    identifier: null 
  });

  readonly leftPuckTransform = computed(() => this.calculatePuckOffset(this.leftStick()));
  readonly rightPuckTransform = computed(() => this.calculatePuckOffset(this.rightStick()));

  readonly rightControlType = computed<RightControlType>(() => {
    switch (this.state.topology()) {
      case 'platformer': return 'button-jump';
      case 'top-down-rpg': return 'button-interact';
      case 'top-down-action': return 'stick';
      default: return 'button-interact';
    }
  });

  // --- JOYSTICK LOGIC ---

  onZoneStart(e: TouchEvent, zone: 'left' | 'right'): void {
    if (this.state.isOverlayOpen()) return;
    
    e.preventDefault();
    this.input.isUsingJoypad.set(true);

    const touch = e.changedTouches[0];
    if (!touch) return;

    const stick = zone === 'left' ? this.leftStick : this.rightStick;

    stick.set({
      active: true,
      originX: touch.clientX,
      originY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      identifier: touch.identifier
    });

    this.triggerHapticFeedback('light');
    this.updateEngineVectors();
  }

  onZoneMove(e: TouchEvent): void {
    if (this.state.isOverlayOpen()) return;
    
    e.preventDefault();
    
    const touches = e.changedTouches;
    let updated = false;

    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      if (!t) continue;

      if (t.identifier === this.leftStick().identifier) {
        this.leftStick.update(s => ({ ...s, currentX: t.clientX, currentY: t.clientY }));
        updated = true;
      }

      if (t.identifier === this.rightStick().identifier) {
        this.rightStick.update(s => ({ ...s, currentX: t.clientX, currentY: t.clientY }));
        updated = true;
      }
    }

    if (updated) {
      this.updateEngineVectors();
    }
  }

  onZoneEnd(e: TouchEvent, zone: 'left' | 'right'): void {
    e.preventDefault();
    
    const touches = e.changedTouches;
    const stick = zone === 'left' ? this.leftStick : this.rightStick;
    const currentStick = stick();

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      if (touch && touch.identifier === currentStick.identifier) {
        stick.set({ 
          ...currentStick, 
          active: false, 
          currentX: currentStick.originX, 
          currentY: currentStick.originY, 
          identifier: null 
        });
        break;
      }
    }

    this.updateEngineVectors();
  }

  // --- BUTTON LOGIC ---

  onAction(e: TouchEvent, isActive: boolean): void {
    if (this.state.isOverlayOpen()) return;
    
    e.preventDefault();
    e.stopPropagation();
    this.input.isUsingJoypad.set(true);
    
    if (isActive) {
      this.triggerHapticFeedback('medium');
    }
    
    if (this.state.topology() === 'platformer') {
      this.input.jump.set(isActive);
    } else {
      this.input.action.set(isActive);
    }
  }

  // --- INTERNAL PHYSICS ---

  private updateEngineVectors(): void {
    this.updateMoveVector();
    this.updateLookVector();
  }

  private updateMoveVector(): void {
    const l = this.leftStick();
    
    if (l.active) {
      const v = this.calculateVector(l);
      
      if (this.state.topology() === 'platformer') {
        this.input.moveVector.set({ x: v.x, y: 0 });
      } else {
        this.input.moveVector.set({ x: v.x, y: -v.y });
      }
    } else {
      this.input.moveVector.set({ x: 0, y: 0 });
    }
  }

  private updateLookVector(): void {
    const r = this.rightStick();
    
    if (r.active && this.rightControlType() === 'stick') {
      const v = this.calculateVector(r);
      this.input.lookVector.set({ x: v.x, y: -v.y });
    } else {
      this.input.lookVector.set({ x: 0, y: 0 });
    }
  }

  private calculateVector(s: StickState): Vector2D {
    const dx = s.currentX - s.originX;
    const dy = s.currentY - s.originY;
    const distance = Math.hypot(dx, dy);
    
    if (distance === 0) {
      return { x: 0, y: 0 };
    }
    
    const rawMagnitude = Math.min(distance / this.JOYSTICK_MAX_DISTANCE, 1.0);
    
    if (rawMagnitude < this.DEAD_ZONE_THRESHOLD) {
      return { x: 0, y: 0 };
    }
    
    const adjustedMagnitude = ((rawMagnitude - this.DEAD_ZONE_THRESHOLD) / (1.0 - this.DEAD_ZONE_THRESHOLD)) * this.SENSITIVITY;
    const angle = Math.atan2(dy, dx);
    
    return {
      x: Math.cos(angle) * adjustedMagnitude,
      y: Math.sin(angle) * adjustedMagnitude
    };
  }

  private calculatePuckOffset(s: StickState): Vector2D {
    let dx = s.currentX - s.originX;
    let dy = s.currentY - s.originY;
    const distance = Math.hypot(dx, dy);
    
    if (distance > this.JOYSTICK_MAX_DISTANCE) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * this.JOYSTICK_MAX_DISTANCE;
      dy = Math.sin(angle) * this.JOYSTICK_MAX_DISTANCE;
    }
    
    return { x: dx, y: dy };
  }

  private triggerHapticFeedback(intensity: 'light' | 'medium' | 'heavy'): void {
    if ('vibrate' in navigator) {
      const duration = intensity === 'light' ? 10 : intensity === 'medium' ? 20 : 30;
      navigator.vibrate(duration);
    }
  }
}
