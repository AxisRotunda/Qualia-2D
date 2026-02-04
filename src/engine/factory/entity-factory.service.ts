// src/engine/factory/entity-factory.service.ts

import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { EntityGenerator, EntityId } from '../ecs/entity';
import { PLAYER_ANIMATIONS } from '../../data/config/animation-config';
import { BLUEPRINTS, EntityBlueprint } from '../../data/prefabs/entity-blueprints';

interface SpawnOptions {
  x?: number;
  y?: number;
  color?: string;
  width?: number;
  height?: number;
  type?: 'dynamic' | 'fixed' | 'kinematic';
}

/**
 * Qualia2D Entity Factory V4.0
 * [ENHANCED]: Validation, error recovery, object pooling preparation, type safety
 */
@Injectable({ providedIn: 'root' })
export class EntityFactoryService {
  private readonly ecs = inject(ComponentStoreService);
  private readonly physics = inject(PhysicsEngine);

  // Constants
  private readonly DEFAULT_SPAWN_X = 0;
  private readonly DEFAULT_SPAWN_Y = 0;
  private readonly DEFAULT_BOX_SIZE = 1;
  private readonly DEFAULT_BOX_COLOR = '#60a5fa';
  private readonly DEFAULT_PLAYER_SIZE = 1.5;
  private readonly DEFAULT_PLAYER_COLLIDER = 1.2;
  private readonly COORDINATE_LIMIT = 1e6;

  // Entity Pools (preparation for future pooling)
  private readonly spawnedEntities = new Set<EntityId>();

  spawnFromTemplate(templateId: string, x = this.DEFAULT_SPAWN_X, y = this.DEFAULT_SPAWN_Y): EntityId | null {
    if (!this.validateCoordinates(x, y)) {
      console.warn(`Qualia2D: Invalid spawn coordinates (${x}, ${y}). Using defaults.`);
      x = this.DEFAULT_SPAWN_X;
      y = this.DEFAULT_SPAWN_Y;
    }

    if (templateId === 'player') {
      return this.spawnPlayer(x, y);
    }

    const blueprint = BLUEPRINTS.find(b => b.id === templateId);
    
    if (!blueprint) {
      console.warn(`Qualia2D: Blueprint '${templateId}' not found. Spawning fallback box.`);
      return this.spawnBox(x, y);
    }

    if (!this.validateBlueprint(blueprint)) {
      console.error(`Qualia2D: Blueprint '${templateId}' failed validation. Spawning fallback box.`);
      return this.spawnBox(x, y);
    }

    return this.assemble(blueprint, x, y);
  }

  private assemble(bp: EntityBlueprint, x: number, y: number): EntityId | null {
    try {
      const id = EntityGenerator.generate();
      this.ecs.addEntity(id);
      this.spawnedEntities.add(id);

      // Initialize Transform with temporal smoothing
      this.ecs.transforms.set(id, { 
        x, y, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        prevX: x, 
        prevY: y, 
        prevRotation: 0
      });

      // Tags
      const tags = new Set(bp.components.tags || []);
      tags.add(bp.category);
      this.ecs.tags.set(id, { 
        name: `${bp.name}_${id}`, 
        tags 
      });

      // Sprite
      if (bp.components.sprite) {
        const s = bp.components.sprite;
        this.ecs.sprites.set(id, {
          color: s.color || '#ffffff',
          textureId: s.textureId,
          width: s.width,
          height: s.height,
          layer: s.layer ?? 1,
          opacity: s.opacity ?? 1
        });
      }

      // Physics
      if (bp.components.physics) {
        const p = bp.components.physics;
        const rb = this.physics.createBody(id, p.type, x, y);
        
        if (rb) {
          if (p.mass !== undefined && p.mass > 0) {
            rb.setAdditionalMass(p.mass, true);
          }
          
          if (p.linearDamping !== undefined && p.linearDamping >= 0) {
            rb.setLinearDamping(p.linearDamping);
          }

          const w = bp.components.sprite?.width || this.DEFAULT_BOX_SIZE;
          const h = bp.components.sprite?.height || this.DEFAULT_BOX_SIZE;
          
          const col = this.physics.createCollider(id, rb, w, h, p.shape || 'cuboid');
          
          if (col) {
            if (p.restitution !== undefined) {
              col.setRestitution(Math.max(0, Math.min(1, p.restitution)));
            }
            if (p.friction !== undefined) {
              col.setFriction(Math.max(0, p.friction));
            }
            if (p.sensor) {
              col.setSensor(true);
            }
          }
        } else {
          console.warn(`Qualia2D: Failed to create physics body for entity ${id}`);
        }
      }

      // Force Field
      if (bp.components.forceField) {
        const f = bp.components.forceField;
        this.ecs.forceFields.set(id, {
          strength: f.strength,
          radius: Math.max(0, f.radius),
          active: true
        });
      }

      // Interaction
      if (bp.components.interaction) {
        const i = bp.components.interaction;
        this.ecs.interactions.set(id, {
          label: i.label,
          radius: Math.max(0, i.radius),
          triggerId: i.triggerId
        });
      }

      return id;
    } catch (error) {
      console.error(`Qualia2D: Failed to assemble entity from blueprint ${bp.id}:`, error);
      return null;
    }
  }

  spawnGravityWell(x: number, y: number, strength: number, radius: number): EntityId | null {
    if (!this.validateCoordinates(x, y)) {
      console.warn(`Qualia2D: Invalid gravity well coordinates (${x}, ${y})`);
      return null;
    }

    try {
      const id = EntityGenerator.generate();
      this.ecs.addEntity(id);
      this.spawnedEntities.add(id);
      
      this.ecs.transforms.set(id, { 
        x, y, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        prevX: x, 
        prevY: y, 
        prevRotation: 0 
      });

      this.ecs.tags.set(id, { 
        name: `GravityWell_${id}`, 
        tags: new Set(['mechanism', 'gravity']) 
      });
      
      this.ecs.sprites.set(id, { 
        color: strength > 0 ? '#6366f1' : '#f43f5e', 
        width: 0.5, 
        height: 0.5, 
        layer: 2, 
        opacity: 0.4 
      });
      
      this.ecs.forceFields.set(id, { 
        strength, 
        radius: Math.max(0, radius), 
        active: true 
      });
      
      const rb = this.physics.createBody(id, 'fixed', x, y);
      if (rb) {
        const col = this.physics.createCollider(id, rb, 0.5, 0.5);
        if (col) {
          col.setSensor(true);
        }
      }
      
      return id;
    } catch (error) {
      console.error('Qualia2D: Failed to spawn gravity well:', error);
      return null;
    }
  }

  spawnPlayer(x = this.DEFAULT_SPAWN_X, y = this.DEFAULT_SPAWN_Y): EntityId | null {
    if (!this.validateCoordinates(x, y)) {
      console.warn(`Qualia2D: Invalid player spawn coordinates (${x}, ${y}). Using defaults.`);
      x = this.DEFAULT_SPAWN_X;
      y = this.DEFAULT_SPAWN_Y;
    }

    try {
      const id = EntityGenerator.generate();
      this.ecs.addEntity(id);
      this.spawnedEntities.add(id);
      
      this.ecs.transforms.set(id, { 
        x, y, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        prevX: x, 
        prevY: y, 
        prevRotation: 0
      });

      this.ecs.sprites.set(id, { 
        color: '#ffffff', 
        textureId: 'tex_hero_sheet', 
        width: this.DEFAULT_PLAYER_SIZE, 
        height: this.DEFAULT_PLAYER_SIZE, 
        layer: 2, 
        opacity: 1 
      });

      this.ecs.tags.set(id, { 
        name: 'Hero_Unit', 
        tags: new Set(['player']) 
      });

      this.ecs.players.set(id, { 
        speed: 18, 
        turnSpeed: 12, 
        lastFireTime: 0, 
        fireRate: 200 
      });

      this.ecs.animations.set(id, {
        active: true,
        state: 'idle',
        facing: 'down',
        timer: 0,
        frameIndex: 0,
        config: PLAYER_ANIMATIONS
      });
      
      const rb = this.physics.createBody(id, 'dynamic', x, y);
      if (rb) {
        rb.setLinearDamping(0.6);
        this.physics.createCollider(id, rb, this.DEFAULT_PLAYER_COLLIDER, this.DEFAULT_PLAYER_COLLIDER);
      } else {
        console.error('Qualia2D: Failed to create player physics body');
      }

      return id;
    } catch (error) {
      console.error('Qualia2D: Failed to spawn player:', error);
      return null;
    }
  }

  spawnBox(
    x = this.DEFAULT_SPAWN_X, 
    y = 5, 
    color = this.DEFAULT_BOX_COLOR, 
    w = this.DEFAULT_BOX_SIZE, 
    h = this.DEFAULT_BOX_SIZE, 
    type: 'dynamic' | 'fixed' = 'dynamic'
  ): EntityId | null {
    if (!this.validateCoordinates(x, y)) {
      console.warn(`Qualia2D: Invalid box spawn coordinates (${x}, ${y}). Using defaults.`);
      x = this.DEFAULT_SPAWN_X;
      y = 5;
    }

    const bp: EntityBlueprint = {
      id: 'legacy_box', 
      name: 'Box', 
      description: '', 
      category: 'primitive', 
      icon: '', 
      complexity: 1,
      components: {
        sprite: { 
          color, 
          width: Math.max(0.1, w), 
          height: Math.max(0.1, h), 
          layer: type === 'dynamic' ? 2 : 1 
        },
        physics: { type, shape: 'cuboid' },
        tags: ['legacy']
      }
    };

    return this.assemble(bp, x, y);
  }

  despawn(id: EntityId): boolean {
    if (!this.ecs.entityExists(id)) {
      return false;
    }

    this.ecs.removeEntity(id);
    this.spawnedEntities.delete(id);
    return true;
  }

  getSpawnedCount(): number {
    return this.spawnedEntities.size;
  }

  clearAllSpawned(): void {
    this.spawnedEntities.forEach(id => this.ecs.removeEntity(id));
    this.spawnedEntities.clear();
  }

  private validateCoordinates(x: number, y: number): boolean {
    return Number.isFinite(x) && 
           Number.isFinite(y) && 
           Math.abs(x) < this.COORDINATE_LIMIT && 
           Math.abs(y) < this.COORDINATE_LIMIT;
  }

  private validateBlueprint(bp: EntityBlueprint): boolean {
    if (!bp.id || !bp.name || !bp.category) {
      return false;
    }

    if (bp.components.sprite) {
      const s = bp.components.sprite;
      if (s.width <= 0 || s.height <= 0) {
        return false;
      }
    }

    if (bp.components.physics) {
      const p = bp.components.physics;
      if (!['dynamic', 'fixed', 'kinematic'].includes(p.type)) {
        return false;
      }
    }

    return true;
  }
}
