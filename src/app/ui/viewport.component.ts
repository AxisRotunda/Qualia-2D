
import { Component, ElementRef, ViewChild, AfterViewInit, inject, HostListener } from '@angular/core';
import { Engine2DService } from '../../services/engine-2d.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';

@Component({
  selector: 'app-viewport',
  standalone: true,
  template: `
    <canvas #mainCanvas 
      class="block w-full h-full transition-opacity duration-700 cursor-crosshair touch-none overflow-hidden"
      [class.opacity-50]="state.loading()"
      (wheel)="onWheel($event)"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="stopDrag()"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="stopDrag()"
      (contextmenu)="$event.preventDefault()">
    </canvas>
  `,
  host: { 'class': 'block w-full h-full bg-black' }
})
export class ViewportComponent implements AfterViewInit {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private engine = inject(Engine2DService);
  public state = inject(EngineState2DService);

  private isDraggingCamera = false;
  private lastX = 0;
  private lastY = 0;
  private initialPinchDist = 0;
  private initialZoom = 0;

  async ngAfterViewInit() {
    // Initial scene is handled by the orchestrator (App)
    const observer = new ResizeObserver(() => {
       this.engine['renderer'].resize();
    });
    observer.observe(this.canvasRef.nativeElement.parentElement!);
  }

  // Raw hardware access for engine sync
  getCanvas() { return this.canvasRef.nativeElement; }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.state.keys.update(keys => {
      const next = new Set(keys);
      next.add(e.key.toLowerCase());
      return next;
    });
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    this.state.keys.update(keys => {
      const next = new Set(keys);
      next.delete(e.key.toLowerCase());
      return next;
    });
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    this.state.zoomCamera(e.deltaY > 0 ? -5 : 5);
  }

  onMouseDown(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 2 || e.button === 1) {
        this.startCameraDrag(e.clientX, e.clientY);
    } else if (e.button === 0) {
        const foundId = this.engine.selectEntityAt(x, y);
        if (foundId !== null) {
          this.lastX = e.clientX;
          this.lastY = e.clientY;
        } else {
          this.state.selectedEntityId.set(null);
          this.state.isDragging.set(false);
        }
    }
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const worldPos = this.engine.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    this.state.updateCursor(worldPos.x, worldPos.y);

    if (this.isDraggingCamera) {
      this.updateCameraDrag(e.clientX, e.clientY);
    } else if (this.state.isDragging() && this.state.selectedEntityId()) {
      this.updateEntityDrag(e.clientX, e.clientY);
    }
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      const foundId = this.engine.selectEntityAt(x, y, 0.2);
      if (foundId === null) {
        this.startCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
      
      this.lastX = e.touches[0].clientX;
      this.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      this.isDraggingCamera = false;
      this.state.isDragging.set(false);
      this.initialPinchDist = this.getDistance(e.touches[0], e.touches[1]);
      this.initialZoom = this.state.cameraZoom();
    }
  }

  onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const worldPos = this.engine.screenToWorld(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      this.state.updateCursor(worldPos.x, worldPos.y);

      if (this.isDraggingCamera) this.updateCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
      if (this.state.isDragging()) this.updateEntityDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dist = this.getDistance(e.touches[0], e.touches[1]);
      const factor = dist / this.initialPinchDist;
      this.state.cameraZoom.set(Math.max(10, Math.min(200, this.initialZoom * factor)));
    }
  }

  private startCameraDrag(x: number, y: number) {
    this.isDraggingCamera = true;
    this.lastX = x;
    this.lastY = y;
  }

  private updateCameraDrag(x: number, y: number) {
    const dx = (x - this.lastX) / this.state.cameraZoom();
    const dy = -(y - this.lastY) / this.state.cameraZoom();
    this.state.panCamera(-dx, -dy);
    this.lastX = x;
    this.lastY = y;
  }

  private updateEntityDrag(x: number, y: number) {
    const selectedId = this.state.selectedEntityId();
    if (!selectedId) return;
    const worldPos = this.engine.screenToWorld(x, y);
    this.engine.setEntityPosition(selectedId, worldPos.x, worldPos.y);
    this.lastX = x;
    this.lastY = y;
  }

  private getDistance(t1: Touch, t2: Touch) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }

  stopDrag() {
    this.isDraggingCamera = false;
    this.state.isDragging.set(false);
  }
}
