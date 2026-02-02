
import { Injectable } from '@angular/core';
import { EntityId } from '../engine/ecs/entity';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import * as RAPIER from '@dimforge/rapier2d-compat';

@Injectable({ providedIn: 'root' })
export class Physics2DService {
  world: RAPIER.World | null = null;
  private _ready = false;
  private eventQueue: RAPIER.EventQueue | null = null;

  constructor(private store: ComponentStoreService) {}

  async init(): Promise<void> {
    if (this._ready) return;
    
    try {
        // Rapier compat needs an async init to load the embedded WASM
        await RAPIER.init();
        this.world = new RAPIER.World({ x: 0.0, y: -9.81 });
        this.eventQueue = new RAPIER.EventQueue();
        this._ready = true;
        console.log("Qualia2D: Physics Initialized");
    } catch (err) {
        console.error("Qualia2D: Failed to initialize Rapier2D", err);
    }
  }

  createBody(id: EntityId, type: 'dynamic' | 'fixed', x: number, y: number): RAPIER.RigidBody | null {
    if (!this.world) return null;
    
    let desc;
    if (type === 'dynamic') {
        desc = RAPIER.RigidBodyDesc.dynamic();
    } else {
        desc = RAPIER.RigidBodyDesc.fixed();
    }
    
    desc.setTranslation(x, y);
    const handle = this.world.createRigidBody(desc);
    
    this.store.rigidBodies.set(id, { handle, bodyType: type });
    return handle;
  }

  createCollider(id: EntityId, bodyHandle: RAPIER.RigidBody, width: number, height: number): RAPIER.Collider | null {
    if (!this.world) return null;
    
    // Rapier takes half-extents for cuboids
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2);
    const handle = this.world.createCollider(colliderDesc, bodyHandle);
    
    this.store.colliders.set(id, { handle, shape: 'cuboid' });
    return handle;
  }

  step(dt: number) {
    if (!this.world || !this.eventQueue) return;
    // Step simulation using fixed dt or current frame dt
    this.world.step(this.eventQueue);
  }

  syncTransformsToECS() {
    if (!this.world) return;
    
    this.store.rigidBodies.forEach((rb, id) => {
        if (rb.bodyType === 'dynamic') {
            const t = rb.handle.translation();
            const r = rb.handle.rotation();
            const ecsTransform = this.store.transforms.get(id);
            if (ecsTransform) {
                ecsTransform.x = t.x;
                ecsTransform.y = t.y;
                ecsTransform.rotation = r;
            }
        }
    });
  }
  
  reset() {
      if(this.world) {
        // Re-initialize world with default gravity
        this.world.free();
        this.world = new RAPIER.World({ x: 0.0, y: -9.81 });
      }
  }
}
