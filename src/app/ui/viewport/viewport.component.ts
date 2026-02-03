import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, HostListener } from '@angular/core';
import { Engine2DService } from '../../../services/engine-2d.service';
import { EngineState2DService } from '../../../services/engine-state-2d.service';
import { Camera2DService } from '../../../services/camera-2d.service';
import { Input2DService } from '../../../services/input-2d.service';
import { Selection2DService } from '../../../services/selection-2d.service';

@Component({
  selector: 'app-viewport',
  standalone: true,
  template: `
    <canvas #mainCanvas 
      class="block w-full h-full transition-opacity duration-700 cursor-crosshair touch-none overflow-hidden"
      [class.opacity-50]="state.loading()"
      [style.pointer-events]="state.isOverlayOpen() ? 'none' : 'auto'"
      (wheel)="onWheel($event)"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="stopDrag()"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd($event)"
      (touchcancel)="onTouchEnd($event)"
      (contextmenu)="$event.preventDefault()">
    </canvas>
  `,
  host: { 'class': 'block w-full h-full bg-black' }
})
export class ViewportComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
  camera = inject(Camera2DService);
  input = inject(Input2DService);
  selection = inject(Selection2DService);

  private isDraggingCamera = false;
  private lastX = 0;
  private lastY = 0;
  private initialPinchDist = 0;
  private initialZoom = 0;
  private longPressTimeout: any = null;
  private resizeObserver: ResizeObserver | null = null;

  async ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
       window.requestAnimationFrame(() => {
          this.engine.renderer.resize();
       });
    });
    
    const parent = this.canvasRef.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver.observe(parent);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.longPressTimeout) clearTimeout(this.longPressTimeout);
  }

  getCanvas() { return this.canvasRef.nativeElement; }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (this.state.isOverlayOpen()) return;
    this.input.updateKeys(e.key, true);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    this.input.updateKeys(e.key, false);
  }

  onWheel(e: WheelEvent) {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    this.camera.setZoom(this.camera.zoom() * factor);
  }

  onMouseDown(e: MouseEvent) {
    if (this.state.isOverlayOpen()) return;
    this.input.interactionDevice.set('mouse');
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 2 || e.button === 1) {
        this.startCameraDrag(e.clientX, e.clientY);
    } else if (e.button === 0) {
        const foundId = this.selection.selectAt(x, y);
        if (foundId !== null) {
          this.lastX = e.clientX;
          this.lastY = e.clientY;
        } else {
          this.selection.clearSelection();
          this.startCameraDrag(e.clientX, e.clientY);
        }
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.state.isOverlayOpen()) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const worldPos = this.camera.screenToWorld(
      e.clientX - rect.left, 
      e.clientY - rect.top, 
      this.engine.renderer.width, 
      this.engine.renderer.height
    );
    this.input.setCursor(worldPos.x, worldPos.y);

    if (this.isDraggingCamera) {
      this.updateCameraDrag(e.clientX, e.clientY);
    } else if (this.input.isDragging() && this.state.selectedEntityId()) {
      this.updateEntityDrag(e.clientX, e.clientY);
    }
  }

  onTouchStart(e: TouchEvent) {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();
    
    this.input.interactionDevice.set('touch');
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    
    if (e.touches.length === 1) {
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      this.lastX = e.touches[0].clientX;
      this.lastY = e.touches[0].clientY;

      if (this.state.mode() === 'play') {
          this.longPressTimeout = setTimeout(() => {
              this.selection.selectAt(x, y);
          }, 400);
      } else {
          const foundId = this.selection.selectAt(x, y);
          if (foundId === null) {
            this.startCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
          }
      }
    } else if (e.touches.length === 2) {
      this.cancelLongPress();
      this.isDraggingCamera = true;
      this.input.setDragging(false);
      this.lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      this.lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      this.initialPinchDist = this.getDistance(e.touches[0], e.touches[1]);
      this.initialZoom = this.camera.zoom();
    }
  }

  onTouchMove(e: TouchEvent) {
    if (this.state.isOverlayOpen()) return;
    e.preventDefault();

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    
    if (e.touches.length === 1) {
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      if (Math.hypot(x - (this.lastX - rect.left), y - (this.lastY - rect.top)) > 15) {
        this.cancelLongPress();
      }

      const worldPos = this.camera.screenToWorld(x, y, this.engine.renderer.width, this.engine.renderer.height);
      this.input.setCursor(worldPos.x, worldPos.y);

      if (this.isDraggingCamera) this.updateCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
      if (this.input.isDragging()) this.updateEntityDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dist = this.getDistance(e.touches[0], e.touches[1]);
      const factor = dist / this.initialPinchDist;
      this.camera.setZoom(this.initialZoom * factor);
      
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      this.updateCameraDrag(centerX, centerY);
    }
  }

  onTouchEnd(e: TouchEvent) {
    this.cancelLongPress();
    if (e.touches.length === 0) {
      this.stopDrag();
    } else if (e.touches.length === 1) {
      this.lastX = e.touches[0].clientX;
      this.lastY = e.touches[0].clientY;
      this.isDraggingCamera = this.state.mode() === 'edit';
    }
  }

  private cancelLongPress() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
  }

  private startCameraDrag(x: number, y: number) {
    this.isDraggingCamera = true;
    this.lastX = x;
    this.lastY = y;
  }

  private updateCameraDrag(x: number, y: number) {
    const dx = (x - this.lastX) / this.camera.zoom();
    const dy = -(y - this.lastY) / this.camera.zoom();
    this.camera.pan(-dx, -dy);
    this.lastX = x;
    this.lastY = y;
  }

  private updateEntityDrag(x: number, y: number) {
    const selectedId = this.state.selectedEntityId();
    if (!selectedId) return;
    const worldPos = this.camera.screenToWorld(x, y, this.engine.renderer.width, this.engine.renderer.height);
    this.engine.setEntityPosition(selectedId, worldPos.x, worldPos.y);
    this.lastX = x;
    this.lastY = y;
  }

  private getDistance(t1: Touch, t2: Touch) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }

  stopDrag() {
    this.isDraggingCamera = false;
    this.input.setDragging(false);
  }
}