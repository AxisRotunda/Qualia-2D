
import { Injectable, signal, computed } from '@angular/core';
import { EntityId } from './entity';
import { Transform2D, Sprite2D, RigidBody2D, Collider2D, TagComponent } from './components';

@Injectable({ providedIn: 'root' })
export class ComponentStoreService {
  // Using Maps for sparse storage (simple ECS implementation)
  readonly transforms = new Map<EntityId, Transform2D>();
  readonly sprites = new Map<EntityId, Sprite2D>();
  readonly rigidBodies = new Map<EntityId, RigidBody2D>();
  readonly colliders = new Map<EntityId, Collider2D>();
  readonly tags = new Map<EntityId, TagComponent>();

  // Signals for reactive UI
  private _entityCount = signal(0);
  readonly entityCount = this._entityCount.asReadonly();

  // Active entity list (simplified)
  readonly entities = new Set<EntityId>();

  addEntity(id: EntityId) {
    this.entities.add(id);
    this._entityCount.set(this.entities.size);
  }

  removeEntity(id: EntityId) {
    this.entities.delete(id);
    this.transforms.delete(id);
    this.sprites.delete(id);
    this.rigidBodies.delete(id);
    this.colliders.delete(id);
    this.tags.delete(id);
    this._entityCount.set(this.entities.size);
  }

  clear() {
    this.entities.clear();
    this.transforms.clear();
    this.sprites.clear();
    this.rigidBodies.clear();
    this.colliders.clear();
    this.tags.clear();
    this._entityCount.set(0);
  }

  // Component Accessors
  getTransform(id: EntityId): Transform2D | undefined { return this.transforms.get(id); }
  getSprite(id: EntityId): Sprite2D | undefined { return this.sprites.get(id); }
}
