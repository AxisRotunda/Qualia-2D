import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { EntityGenerator, EntityId } from '../ecs/entity';

@Injectable({ providedIn: 'root' })
export class EntityFactoryService {
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);

  spawnFromTemplate(templateId: string, x = 0, y = 0): EntityId {
    switch(templateId) {
      case 'player': return this.spawnPlayer(x, y);
      case 'box_static': return this.spawnBox(x, y, '#475569', 2, 0.5, 'fixed');
      case 'box_dynamic': return this.spawnBox(x, y, '#6366f1', 1, 1, 'dynamic');
      case 'gravity_well': return this.spawnGravityWell(x, y, 20, 5);
      case 'sensor_area': return this.spawnBox(x, y, 'rgba(16, 185, 129, 0.2)', 2, 2, 'fixed');
      default: return this.spawnBox(x, y);
    }
  }

  spawnPlayer(x = 0, y = 0): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color: '#6366f1', width: 1.2, height: 1.2, layer: 2, opacity: 1 });
    this.ecs.tags.set(id, { name: 'Player_Hero', tags: new Set(['player']) });
    this.ecs.players.set(id, { speed: 15, turnSpeed: 10, lastFireTime: 0, fireRate: 200 });
    const rb = this.physics.createBody(id, 'dynamic', x, y);
    if (rb) {
        rb.setLinearDamping(0.5);
        this.physics.createCollider(id, rb, 1.2, 1.2);
    }
    return id;
  }

  spawnGravityWell(x = 0, y = 0, strength = 20, radius = 5): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.forceFields.set(id, { strength, radius, active: true });
    this.ecs.tags.set(id, { name: `GravityWell_${id}`, tags: new Set(['force_field']) });
    return id;
  }

  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic'): EntityId {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color, width: w, height: h, layer: 1, opacity: 1 });
    this.ecs.tags.set(id, { name: `${type === 'dynamic' ? 'Box' : 'Platform'}_${id}`, tags: new Set(['physics_object']) });
    const rb = this.physics.createBody(id, type, x, y);
    if (rb) this.physics.createCollider(id, rb, w, h);
    return id;
  }
}