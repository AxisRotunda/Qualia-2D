import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { EngineState2DService } from './engine-state-2d.service';
import { SelectionSystem } from '../engine/systems/selection-system';
import { Input2DService } from './input-2d.service';
import { CameraService } from '../engine/core/camera.service';
import { EntityId } from '../engine/ecs/entity';

@Injectable({ providedIn: 'root' })
export class Mutation2DService {
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);
  private state = inject(EngineState2DService);
  private selection = inject(SelectionSystem);
  private input = inject(Input2DService);
  private camera = inject(CameraService);

  deleteEntity(id: EntityId) {
    const rb = this.ecs.rigidBodies.get(id);
    if (rb && this.physics.world) {
      this.physics.world.removeRigidBody(rb.handle);
    }
    this.ecs.removeEntity(id);
    
    if (this.state.selectedEntityId() === id) {
      this.selection.clearSelection();
    }
    if (this.camera.followedEntityId() === id) {
      this.camera.followedEntityId.set(null);
    }
  }

  updateSpriteColor(id: EntityId, color: string) {
    const s = this.ecs.sprites.get(id);
    if (s) s.color = color;
  }

  updateEntityName(id: EntityId, name: string) {
    const tag = this.ecs.tags.get(id);
    if (tag) tag.name = name;
  }

  updateEntitySize(id: EntityId, width: number, height: number) {
    const s = this.ecs.sprites.get(id);
    const rb = this.ecs.rigidBodies.get(id);
    const col = this.ecs.colliders.get(id);
    
    if (s) { s.width = width; s.height = height; }
    if (rb && col && this.physics.world) {
      this.physics.world.removeCollider(col.handle, true);
      const newCol = this.physics.createCollider(id, rb.handle, width, height);
      if (newCol) this.ecs.colliders.set(id, { handle: newCol, shape: 'cuboid' });
    }
  }

  setEntityPosition(id: EntityId, x: number, y: number) {
    const t = this.ecs.transforms.get(id);
    const rb = this.ecs.rigidBodies.get(id);
    if (this.state.mode() === 'edit') {
      if (t) { t.x = x; t.y = y; }
      if (rb) { rb.handle.setTranslation({ x, y }, true); }
    } else {
      this.input.dragTargetPos.set({ x, y });
    }
  }
}