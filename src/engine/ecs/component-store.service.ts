
import { Injectable, signal } from '@angular/core';
import { EntityId } from './entity';
import { Transform2D, Sprite2D, RigidBody2D, Collider2D, TagComponent, ForceField2D, PlayerController2D, SpriteAnimation, Interaction } from './components';

/**
 * Registry-backed ECS Storage System.
 * Automates component cleanup and provides a unified interface for entity lifecycle.
 */
@Injectable({ providedIn: 'root' })
export class ComponentStoreService {
  // Core Component Repositories
  readonly transforms = new Map<EntityId, Transform2D>();
  readonly sprites = new Map<EntityId, Sprite2D>();
  readonly rigidBodies = new Map<EntityId, RigidBody2D>();
  readonly colliders = new Map<EntityId, Collider2D>();
  readonly tags = new Map<EntityId, TagComponent>();
  readonly forceFields = new Map<EntityId, ForceField2D>();
  readonly players = new Map<EntityId, PlayerController2D>();
  
  // RPG Systems
  readonly animations = new Map<EntityId, SpriteAnimation>();
  readonly interactions = new Map<EntityId, Interaction>();

  /**
   * Registry of all component maps for automated lifecycle management.
   * Prevents "orphaned components" during entity deletion.
   */
  // FIX: Explicitly providing generic types to the Map constructor to avoid incorrect 
  // inference from the first array element, which causes type mismatches for subsequent entries.
  private readonly registries = new Map<string, Map<EntityId, any>>([
    ['transform', this.transforms],
    ['sprite', this.sprites],
    ['rigidBody', this.rigidBodies],
    ['collider', this.colliders],
    ['tag', this.tags],
    ['forceField', this.forceFields],
    ['player', this.players],
    ['animation', this.animations],
    ['interaction', this.interactions]
  ]);

  // High-level State Signals
  private _entities = signal<EntityId[]>([]);
  readonly entitiesList = this._entities.asReadonly();
  readonly entityCount = signal(0);

  /**
   * Registers a new entity in the system.
   */
  addEntity(id: EntityId) {
    this._entities.update(list => [...list, id]);
    this.entityCount.set(this._entities().length);
  }

  /**
   * Removes an entity and all its associated components across all registries.
   * [RUN_REF Optimization]: Automated iteration over the component registry.
   */
  removeEntity(id: EntityId) {
    this._entities.update(list => list.filter(e => e !== id));
    this.registries.forEach(registry => registry.delete(id));
    this.entityCount.set(this._entities().length);
  }

  /**
   * Resets the entire ECS state.
   */
  clear() {
    this._entities.set([]);
    this.registries.forEach(registry => registry.clear());
    this.entityCount.set(0);
  }

  // Domain-Specific Accessors
  getTransform(id: EntityId): Transform2D | undefined { return this.transforms.get(id); }
  getSprite(id: EntityId): Sprite2D | undefined { return this.sprites.get(id); }
  getForceField(id: EntityId): ForceField2D | undefined { return this.forceFields.get(id); }
  getPlayer(id: EntityId): PlayerController2D | undefined { return this.players.get(id); }
  getAnimation(id: EntityId): SpriteAnimation | undefined { return this.animations.get(id); }
  getInteraction(id: EntityId): Interaction | undefined { return this.interactions.get(id); }
  
  /**
   * Utility for bulk component checks (e.g., for systems filtering).
   */
  hasComponents(id: EntityId, ...types: string[]): boolean {
    return types.every(t => this.registries.get(t)?.has(id));
  }
}