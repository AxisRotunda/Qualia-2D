import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService } from './services/engine-state-2d.service';
import { CommandRegistryService, QualiaVerb } from './services/command-registry.service';
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
  commands = inject(CommandRegistryService);
  
  scenes = SCENES;

  private isDraggingCamera = false;
  private isDraggingEntity = false;
  private lastX = 0;
  private lastY = 0;
  private initialPinchDist = 0;
  private initialZoom = 0;

  async ngAfterViewInit() {
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
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 2 || e.button === 1) {
        this.startCameraDrag(e.clientX, e.clientY);
    } else if (e.button === 0) {
        const foundId = this.engine.selectEntityAt(x, y);
        if (foundId !== null && this.state.mode() === 'edit') {
          this.isDraggingEntity = true;
          this.lastX = e.clientX;
          this.lastY = e.clientY;
        } else if (foundId === null) {
          this.state.selectedEntityId.set(null);
        }
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isDraggingCamera) {
      this.updateCameraDrag(e.clientX, e.clientY);
    } else if (this.isDraggingEntity && this.state.selectedEntityId()) {
      this.updateEntityDrag(e.clientX, e.clientY);
    }
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      const foundId = this.engine.selectEntityAt(x, y);
      if (foundId !== null && this.state.mode() === 'edit') {
        this.isDraggingEntity = true;
      } else {
        this.startCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
      this.lastX = e.touches[0].clientX;
      this.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      this.isDraggingCamera = false;
      this.isDraggingEntity = false;
      this.initialPinchDist = this.getDistance(e.touches[0], e.touches[1]);
      this.initialZoom = this.state.cameraZoom();
    }
  }

  onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1) {
      if (this.isDraggingCamera) this.updateCameraDrag(e.touches[0].clientX, e.touches[0].clientY);
      if (this.isDraggingEntity) this.updateEntityDrag(e.touches[0].clientX, e.touches[0].clientY);
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
    this.isDraggingEntity = false;
  }

  runCommand(verb: QualiaVerb) {
    this.commands.execute(verb);
  }

  updateEntityWidth(id: number, val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const s = this.engine.ecs.getSprite(id);
      if (s) this.engine.updateEntitySize(id, num, s.height);
    }
  }

  updateEntityHeight(id: number, val: string) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const s = this.engine.ecs.getSprite(id);
      if (s) this.engine.updateEntitySize(id, s.width, num);
    }
  }

  updateEntityName(id: number, val: string) {
    this.engine.updateEntityName(id, val);
  }
}