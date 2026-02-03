import { Injectable, signal } from '@angular/core';
import { EntityId } from './entity';
import { Transform2D, Sprite2D, RigidBody2D, Collider2D, TagComponent, ForceField2D, PlayerController2D } from './components';

@Injectable({ providedIn: 'root' })
export class ComponentStoreService {
  readonly transforms = new Map<EntityId, Transform2D>();
  readonly sprites = new Map<EntityId, Sprite2D>();
  readonly rigidBodies = new Map<EntityId, RigidBody2D>();
  readonly colliders = new Map<EntityId, Collider2D>();
  readonly tags = new Map<EntityId, TagComponent>();
  readonly forceFields = new Map<EntityId, ForceField2D>();
  readonly players = new Map<EntityId, PlayerController2D>();

  // Use signal for the entity list to drive Hierarchy UI
  private _entities = signal<EntityId[]>([]);
  readonly entitiesList = this._entities.asReadonly();
  
  readonly entityCount = signal(0);

  addEntity(id: EntityId) {
    this._entities.update(list => [...list, id]);
    this.entityCount.set(this._entities().length);
  }

  removeEntity(id: EntityId) {
    this._entities.update(list => list.filter(e => e !== id));
    this.transforms.delete(id);
    this.sprites.delete(id);
    this.rigidBodies.delete(id);
    this.colliders.delete(id);
    this.tags.delete(id);
    this.forceFields.delete(id);
    this.players.delete(id);
    this.entityCount.set(this._entities().length);
  }

  clear() {
    this._entities.set([]);
    this.transforms.clear();
    this.sprites.clear();
    this.rigidBodies.clear();
    this.colliders.clear();
    this.tags.clear();
    this.forceFields.clear();
    this.players.clear();
    this.entityCount.set(0);
  }

  getTransform(id: EntityId): Transform2D | undefined { return this.transforms.get(id); }
  getSprite(id: EntityId): Sprite2D | undefined { return this.sprites.get(id); }
  getForceField(id: EntityId): ForceField2D | undefined { return this.forceFields.get(id); }
  getPlayer(id: EntityId): PlayerController2D | undefined { return this.players.get(id); }
}