
import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService } from './services/engine-state-2d.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DecimalPipe]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);

  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  async ngAfterViewInit() {
    await this.engine.init(this.canvasRef.nativeElement);
    
    // Handle Window Resize
    const observer = new ResizeObserver(() => {
       this.engine['renderer'].resize();
    });
    observer.observe(this.canvasRef.nativeElement.parentElement!);

    // Handle touch scrolling prevention
    this.canvasRef.nativeElement.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvasRef.nativeElement.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  // Input Handling - Wheel/Zoom
  onWheel(e: WheelEvent) {
    e.preventDefault();
    this.state.zoomCamera(e.deltaY > 0 ? -5 : 5);
  }

  // Input Handling - Mouse
  onMouseDown(e: MouseEvent) {
    if (e.button === 2) { // Right click pan
        this.startDrag(e.clientX, e.clientY);
    } else if (e.button === 0) {
        // Select
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.engine.selectEntityAt(e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isDragging) {
        this.updateDrag(e.clientX, e.clientY);
    }
  }

  onMouseUp() {
    this.stopDrag();
  }

  // Input Handling - Touch
  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.startDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // Pinch to zoom logic could be added here
    }
  }

  onTouchMove(e: TouchEvent) {
    if (this.isDragging && e.touches.length === 1) {
      this.updateDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  onTouchEnd() {
    this.stopDrag();
  }

  private startDrag(x: number, y: number) {
    this.isDragging = true;
    this.lastMouseX = x;
    this.lastMouseY = y;
  }

  private updateDrag(x: number, y: number) {
    const dx = (x - this.lastMouseX) / this.state.cameraZoom();
    const dy = -(y - this.lastMouseY) / this.state.cameraZoom(); // Flip Y
    this.state.panCamera(-dx, -dy);
    this.lastMouseX = x;
    this.lastMouseY = y;
  }

  private stopDrag() {
    this.isDragging = false;
  }
}
