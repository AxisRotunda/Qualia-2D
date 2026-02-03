import { Component, inject, signal, computed } from '@angular/core';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { Input2DService } from '../../../services/input-2d.service';

interface StickState {
  active: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  identifier: number | null;
}

@Component({
  selector: 'app-virtual-joypad',
  standalone: true,
  template: `
    @if (state.mode() === 'play') {
      <div class="fixed inset-0 z-30 touch-none select-none pointer-events-none overflow-hidden">
        
        <!-- INDUSTRY_STANDARD: Thumb Capture Corridors -->
        <div class="absolute inset-x-0 bottom-0 h-3/5 flex pointer-events-none" 
             [class.pointer-events-auto]="!state.isOverlayOpen()">
          
          <!-- Left Corridor -->
          <div class="w-2/5 h-full pointer-events-auto"
               (touchstart)="onZoneStart($event, 'left')"
               (touchmove)="onZoneMove($event)"
               (touchend)="onZoneEnd($event, 'left')"
               (touchcancel)="onZoneEnd($event, 'left')">
          </div>

          <!-- Safe Interaction Gap (Center) -->
          <div class="flex-1 h-full pointer-events-none"></div>

          <!-- Right Corridor -->
          @if (state.topology() === 'top-down-action') {
             <div class="w-2/5 h-full pointer-events-auto"
               (touchstart)="onZoneStart($event, 'right')"
               (touchmove)="onZoneMove($event)"
               (touchend)="onZoneEnd($event, 'right')"
               (touchcancel)="onZoneEnd($event, 'right')">
             </div>
          }
        </div>

        <!-- Left Stick Visual -->
        <div class="absolute w-32 h-32 -ml-16 -mt-16 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center transition-opacity duration-150 ease-out will-change-transform"
             [style.left.px]="leftStick().originX"
             [style.top.px]="leftStick().originY"
             [class.opacity-0]="!leftStick().active"
             [class.opacity-100]="leftStick().active">
             <div class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.6)] border border-white/20"
                [style.transform]="'translate(' + leftPuckTransform().x + 'px, ' + leftPuckTransform().y + 'px)'">
                <div class="absolute inset-3 border-2 border-white/10 rounded-full"></div>
             </div>
        </div>

        <!-- Right Stick Visual (Action Only) -->
        @if (state.topology() === 'top-down-action') {
          <div class="absolute w-32 h-32 -ml-16 -mt-16 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center transition-opacity duration-150 ease-out will-change-transform"
               [style.left.px]="rightStick().originX"
               [style.top.px]="rightStick().originY"
               [class.opacity-0]="!rightStick().active"
               [class.opacity-100]="rightStick().active">
               <div class="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-white/20"
                  [style.transform]="'translate(' + rightPuckTransform().x + 'px, ' + rightPuckTransform().y + 'px)'">
                  <div class="absolute inset-3 border-2 border-white/10 rounded-full"></div>
               </div>
          </div>
        }

        <!-- JUMP (Platformer) / INTERACT (RPG) -->
        @if (state.topology() === 'platformer' || state.topology() === 'top-down-rpg') {
           <div class="absolute bottom-8 right-8 flex flex-col gap-6 items-end p-4 pb-12 pr-12"
                [class.pointer-events-none]="state.isOverlayOpen()"
                [class.pointer-events-auto]="!state.isOverlayOpen()">
              <button 
                (touchstart)="onAction($event, true)" 
                (touchend)="onAction($event, false)"
                (touchcancel)="onAction($event, false)"
                class="w-20 h-20 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/20 active:bg-emerald-600 active:border-emerald-400 active:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex items-center justify-center group shadow-2xl">
                <span class="text-xs font-black text-white/90 group-active:text-white group-active:scale-110 transition-transform tracking-widest">
                  {{ state.topology() === 'platformer' ? 'JUMP' : 'ACT' }}
                </span>
              </button>
           </div>
        }
      </div>
    }
  `
})
export class VirtualJoypadComponent {
  state = inject(EngineState2DService);
  input = inject(Input2DService);

  readonly leftStick = signal<StickState>({ active: false, originX: 0, originY: 0, currentX: 0, currentY: 0, identifier: null });
  readonly rightStick = signal<StickState>({ active: false, originX: 0, originY: 0, currentX: 0, currentY: 0, identifier: null });

  readonly leftPuckTransform = computed(() => this.calculatePuckOffset(this.leftStick()));
  readonly rightPuckTransform = computed(() => this.calculatePuckOffset(this.rightStick()));

  onZoneStart(e: TouchEvent, zone: 'left' | 'right') {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();
    this.input.isUsingJoypad.set(true);

    const touch = e.changedTouches[0];
    const stick = zone === 'left' ? this.leftStick : this.rightStick;

    stick.set({
      active: true,
      originX: touch.clientX,
      originY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      identifier: touch.identifier
    });

    this.updateEngineVectors();
  }

  onZoneMove(e: TouchEvent) {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();
    const touches = e.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      if (t.identifier === this.leftStick().identifier) {
        this.leftStick.update(s => ({ ...s, currentX: t.clientX, currentY: t.clientY }));
      }
      if (t.identifier === this.rightStick().identifier) {
        this.rightStick.update(s => ({ ...s, currentX: t.clientX, currentY: t.clientY }));
      }
    }
    this.updateEngineVectors();
  }

  onZoneEnd(e: TouchEvent, zone: 'left' | 'right') {
    e.preventDefault();
    const touches = e.changedTouches;
    const stick = zone === 'left' ? this.leftStick : this.rightStick;

    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === stick().identifier) {
        stick.set({ ...stick(), active: false, currentX: stick().originX, currentY: stick().originY, identifier: null });
      }
    }
    this.updateEngineVectors();
  }

  onAction(e: TouchEvent, isActive: boolean) {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();
    this.input.isUsingJoypad.set(true);
    
    if (this.state.topology() === 'platformer') {
      this.input.moveVector.update(v => ({ x: v.x, y: isActive ? 1 : 0 }));
    } else {
      this.input.action.set(isActive);
    }
  }

  private updateEngineVectors() {
    const l = this.leftStick();
    if (l.active) {
      const v = this.calculateVector(l);
      if (this.state.topology() === 'platformer') {
        this.input.moveVector.set({ x: v.x, y: this.input.moveVector().y }); 
      } else {
        this.input.moveVector.set({ x: v.x, y: -v.y });
      }
    } else if (this.state.topology() !== 'platformer') {
       this.input.moveVector.set({ x: 0, y: 0 });
    } else {
       this.input.moveVector.set({ x: 0, y: this.input.moveVector().y });
    }

    const r = this.rightStick();
    if (r.active && this.state.topology() === 'top-down-action') {
      const v = this.calculateVector(r);
      this.input.lookVector.set({ x: v.x, y: -v.y });
    } else {
      this.input.lookVector.set({ x: 0, y: 0 });
    }
  }

  private calculateVector(s: StickState) {
    const maxDist = 40;
    const dx = s.currentX - s.originX;
    const dy = s.currentY - s.originY;
    const dist = Math.hypot(dx, dy);
    
    if (dist === 0) return { x: 0, y: 0 };
    
    const rawMag = Math.min(dist / maxDist, 1.0);
    const angle = Math.atan2(dy, dx);
    
    return {
      x: Math.cos(angle) * rawMag,
      y: Math.sin(angle) * rawMag
    };
  }

  private calculatePuckOffset(s: StickState) {
    const maxDist = 40;
    let dx = s.currentX - s.originX;
    let dy = s.currentY - s.originY;
    const dist = Math.hypot(dx, dy);
    
    if (dist > maxDist) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * maxDist;
      dy = Math.sin(angle) * maxDist;
    }
    return { x: dx, y: dy };
  }
}