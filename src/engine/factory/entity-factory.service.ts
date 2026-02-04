
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { EntityGenerator, EntityId } from '../ecs/entity';
import { PLAYER_ANIMATIONS } from '../../data/config/animation-config';
import { BLUEPRINTS, EntityBlueprint } from '../../data/prefabs/entity-blueprints';

/**
 * Qualia2D Entity Factory [V3.0]
 * [RUN_REF]: Initializing prev/current transform pairs for temporal smoothing.
 */
@Injectable({ providedIn: 'root' })
export class EntityFactoryService {
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);

  spawnFromTemplate(templateId: string, x = 0, y = 0): EntityId | null {
    if (templateId === 'player') return this.spawnPlayer(x, y);

    const blueprint = BLUEPRINTS.find(b => b.id === templateId);
    if (!blueprint) {
      console.warn(`Qualia2D: Blueprint '${templateId}' not found.`);
      return this.spawnBox(x, y);
    }

    return this.assemble(blueprint, x, y);
  }

  private assemble(bp: EntityBlueprint, x: number, y: number): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);

    // // CoT: Initializing prev and current to the same value to prevent first-frame "warp"
    this.ecs.transforms.set(id, { 
        x, y, rotation: 0, scaleX: 1, scaleY: 1,
        prevX: x, prevY: y, prevRotation: 0
    });

    const tags = new Set(bp.components.tags || []);
    tags.add(bp.category);
    this.ecs.tags.set(id, { name: `${bp.name}_${id}`, tags });

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

    if (bp.components.physics) {
      const p = bp.components.physics;
      const rb = this.physics.createBody(id, p.type, x, y);
      
      if (rb) {
        if (p.mass !== undefined) rb.setAdditionalMass(p.mass, true);
        if (p.linearDamping !== undefined) rb.setLinearDamping(p.linearDamping);

        const w = bp.components.sprite?.width || 1;
        const h = bp.components.sprite?.height || 1;
        
        // CoT: Pass the shape explicitly to the engine (default to cuboid if undefined)
        const col = this.physics.createCollider(id, rb, w, h, p.shape || 'cuboid');
        
        if (col) {
          if (p.restitution !== undefined) col.setRestitution(p.restitution);
          if (p.friction !== undefined) col.setFriction(p.friction);
          if (p.sensor) col.setSensor(true);
        }
      }
    }

    if (bp.components.forceField) {
      const f = bp.components.forceField;
      this.ecs.forceFields.set(id, {
        strength: f.strength,
        radius: f.radius,
        active: true
      });
    }

    if (bp.components.interaction) {
      const i = bp.components.interaction;
      this.ecs.interactions.set(id, {
        label: i.label,
        radius: i.radius,
        triggerId: i.triggerId
      });
    }

    return id;
  }

  spawnGravityWell(x: number, y: number, strength: number, radius: number): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    
    this.ecs.transforms.set(id, { 
        x, y, rotation: 0, scaleX: 1, scaleY: 1,
        prevX: x, prevY: y, prevRotation: 0 
    });
    this.ecs.tags.set(id, { name: `GravityWell_${id}`, tags: new Set(['mechanism', 'gravity']) });
    
    this.ecs.sprites.set(id, { 
      color: strength > 0 ? '#6366f1' : '#f43f5e', 
      width: 0.5, 
      height: 0.5, 
      layer: 2, 
      opacity: 0.4 
    });
    
    this.ecs.forceFields.set(id, { strength, radius, active: true });
    
    const rb = this.physics.createBody(id, 'fixed', x, y);
    if (rb) {
      const col = this.physics.createCollider(id, rb, 0.5, 0.5);
      if (col) col.setSensor(true);
    }
    
    return id;
  }

  spawnPlayer(x = 0, y = 0): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    
    this.ecs.transforms.set(id, { 
        x, y, rotation: 0, scaleX: 1, scaleY: 1,
        prevX: x, prevY: y, prevRotation: 0
    });
    this.ecs.sprites.set(id, { color: '#ffffff', textureId: 'tex_hero_sheet', width: 1.5, height: 1.5, layer: 2, opacity: 1 });
    this.ecs.tags.set(id, { name: 'Hero_Unit', tags: new Set(['player']) });
    this.ecs.players.set(id, { speed: 18, turnSpeed: 12, lastFireTime: 0, fireRate: 200 });
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
        this.physics.createCollider(id, rb, 1.2, 1.2);
    }
    return id;
  }

  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic'): EntityId {
    const bp: EntityBlueprint = {
      id: 'legacy_box', name: 'Box', description: '', category: 'primitive', icon: '', complexity: 1,
      components: {
        sprite: { color, width: w, height: h, layer: type === 'dynamic' ? 2 : 1 },
        physics: { type, shape: 'cuboid' },
        tags: ['legacy']
      }
    };
    return this.assemble(bp, x, y);
  }
}
