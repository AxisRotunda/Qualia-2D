
import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { Input2DService } from './input-2d.service';
import { Physics2DService } from './physics-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Renderer2DService } from './renderer-2d.service';

@Injectable({ providedIn: 'root' })
export class Selection2DService {
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
  private input = inject(Input2DService);
  private physics = inject(Physics2DService);
  private ecs = inject(ComponentStoreService);
  private renderer = inject(Renderer2DService);

  /**
   * Performs a spatial query to select an entity at the given screen coordinates.
   * [INDUSTRY_STANDARD]: Uses camera projection and physics picking.
   */
  selectAt(screenX: number, screenY: number): number | null {
    const interactionType = this.input.interactionDevice();
    const tolerance = interactionType === 'touch' ? 0.6 : 0.1;
    
    const worldPos = this.camera.screenToWorld(
      screenX, 
      screenY, 
      this.renderer.width, 
      this.renderer.height
    );

    // 1. Physics Picking (Colliders)
    let foundId = this.physics.pickEntityAt(worldPos.x, worldPos.y, tolerance);
    
    // 2. Fallback: Component Search (Non-physics objects like Force Fields)
    if (foundId === null) {
      const entities = this.ecs.entitiesList();
      for (let i = entities.length - 1; i >= 0; i--) {
        const id = entities[i];
        if (this.ecs.rigidBodies.has(id)) continue;
        
        const t = this.ecs.getTransform(id);
        const field = this.ecs.getForceField(id);
        
        if (t && field) {
          const dx = worldPos.x - t.x;
          const dy = worldPos.y - t.y;
          // Check proximity to the force field center
          if (dx * dx + dy * dy < (tolerance + 0.3) * (tolerance + 0.3)) {
            foundId = id;
            break;
          }
        }
      }
    }

    this.state.selectedEntityId.set(foundId);
    
    if (foundId !== null) {
      this.input.setDragging(true, worldPos);
    } else {
      this.input.setDragging(false);
    }

    return foundId;
  }

  clearSelection() {
    this.state.selectedEntityId.set(null);
    this.input.setDragging(false);
  }
}
