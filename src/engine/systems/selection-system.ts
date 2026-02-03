import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { CameraService } from '../core/camera.service';
import { Input2DService } from '../../services/input-2d.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { ComponentStoreService } from '../ecs/component-store.service';
import { RenderSystem } from './render-system';

@Injectable({ providedIn: 'root' })
export class SelectionSystem {
  private state = inject(EngineState2DService);
  private camera = inject(CameraService);
  private input = inject(Input2DService);
  private physics = inject(PhysicsEngine);
  private ecs = inject(ComponentStoreService);
  private renderer = inject(RenderSystem);

  selectAt(screenX: number, screenY: number): number | null {
    const interactionType = this.input.interactionDevice();
    const tolerance = interactionType === 'touch' ? 0.6 : 0.1;
    
    const worldPos = this.camera.screenToWorld(
      screenX, 
      screenY, 
      this.renderer.width, 
      this.renderer.height
    );

    let foundId = this.physics.pickEntityAt(worldPos.x, worldPos.y, tolerance);
    
    if (foundId === null) {
      const entities = this.ecs.entitiesList();
      for (let i = entities.length - 1; i >= 0; i--) {
        const id = entities[i];
        if (this.ecs.rigidBodies.has(id)) continue;
        const t = this.ecs.getTransform(id);
        const field = this.ecs.getForceField(id);
        if (t && field) {
          const dx = worldPos.x - t.x; const dy = worldPos.y - t.y;
          if (dx * dx + dy * dy < (tolerance + 0.3) * (tolerance + 0.3)) { foundId = id; break; }
        }
      }
    }

    this.state.selectedEntityId.set(foundId);
    this.input.setDragging(foundId !== null, foundId !== null ? worldPos : undefined);
    return foundId;
  }

  clearSelection() {
    this.state.selectedEntityId.set(null);
    this.input.setDragging(false);
  }
}