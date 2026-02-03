import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { Input2DService } from './input-2d.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';

@Injectable({ providedIn: 'root' })
export class Selection2DService {
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
  private input = inject(Input2DService);
  private physics = inject(PhysicsEngine);
  private ecs = inject(ComponentStoreService);

  /**
   * Performs a spatial query to select an entity.
   * [RUN_REF]: Consolidated system logic into a services façade.
   */
  selectAt(screenX: number, screenY: number): number | null {
    if (!this.physics.world) return null;

    const interactionType = this.input.interactionDevice();
    const tolerance = interactionType === 'touch' ? 0.6 : 0.1;
    
    // UI components are expected to provide canvas dimensions or use engine state
    // For simplicity, we assume the camera-to-world projection is handled via service
    // In a real refactor, we ensure screen dimensions are tracked in EngineState
    const worldPos = this.camera.screenToWorld(
      screenX, 
      screenY, 
      window.innerWidth, // Fallback to window if renderer ref is missing
      window.innerHeight
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