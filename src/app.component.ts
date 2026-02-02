import { Component, ElementRef, ViewChild, AfterViewInit, inject, signal } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService } from './services/engine-state-2d.service';
import { DecimalPipe } from '@angular/common';
import { SCENES } from './data/scene-presets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DecimalPipe],
  host: {
    'class': 'block h-full w-full select-none overflow-hidden touch-none'
  }
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
  
  scenes = SCENES;

  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  private initialPinchDist = 0;
  private initialZoom = 0;

  async ngAfterViewInit() {
    // Pass the first scene as default
    await this.engine.init(this.canvasRef.nativeElement, this.scenes[0]);
    
    const observer = new ResizeObserver(() => {
       this.engine['renderer'].resize();
    });
    observer.observe(this.canvasRef.nativeElement.parentElement!);
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    this.state.zoomCamera(e.deltaY > 0 ? -5 : 5);
  }

  onMouseDown(e: MouseEvent) {
    if (e.button === 2 || e.button === 1) { // Right or middle click pan
        this.startDrag(e.clientX, e.clientY);
    } else if (e.button === 0) {
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.engine.selectEntityAt(e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isDragging) this.updateDrag(e.clientX, e.clientY);
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.startDrag(e.touches[0].clientX, e.touches[0].clientY);
      // Wait for selection on tap
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.engine.selectEntityAt(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    } else if (e.touches.length === 2) {
      this.isDragging = false;
      this.initialPinchDist = this.getDistance(e.touches[0], e.touches[1]);
      this.initialZoom = this.state.cameraZoom();
    }
  }

  onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1 && this.isDragging) {
      this.updateDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dist = this.getDistance(e.touches[0], e.touches[1]);
      const factor = dist / this.initialPinchDist;
      this.state.cameraZoom.set(Math.max(10, Math.min(200, this.initialZoom * factor)));
    }
  }

  private startDrag(x: number, y: number) {
    this.isDragging = true;
    this.lastX = x;
    this.lastY = y;
  }

  private updateDrag(x: number, y: number) {
    const dx = (x - this.lastX) / this.state.cameraZoom();
    const dy = -(y - this.lastY) / this.state.cameraZoom();
    this.state.panCamera(-dx, -dy);
    this.lastX = x;
    this.lastY = y;
  }

  private getDistance(t1: Touch, t2: Touch) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }

  stopDrag() {
    this.isDragging = false;
  }
}
