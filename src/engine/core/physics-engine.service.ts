
import { Injectable, signal, inject } from '@angular/core';
import { EntityId } from '../ecs/entity';
import { ComponentStoreService } from '../ecs/component-store.service';
import * as RAPIER from '@dimforge/rapier2d-compat';

/**
 * Deterministic Physics Core V5.2 (Singularity)
 * [OPTIMIZATION]: Temporal sub-stepping and state caching for zero-jitter interpolation.
 */
@Injectable({ providedIn: 'root' })
export class PhysicsEngine {
  world: RAPIER.World | null = null;
  private _ready = false;
  private eventQueue: RAPIER.EventQueue | null = null;
  
  // Reusable shapes to avoid per-frame allocations
  private pickingSphere: RAPIER.Ball | null = null;

  // Configuration
  private readonly FIXED_TIMESTEP = 1 / 60;
  private accumulator = 0;

  // Signal projections for rendering
  readonly interpolationAlpha = signal(0);

  private store = inject(ComponentStoreService);

  async init(): Promise<void> {
    if (this._ready) return;
    try {
        await RAPIER.init();
        this.world = new RAPIER.World({ x: 0.0, y: -9.81 });
        this.eventQueue = new RAPIER.EventQueue();
        this.pickingSphere = new RAPIER.Ball(0.1); 
        this._ready = true;
        console.log("Qualia2D: Physics Singularity V5.2 Active");
    } catch (err) {
        console.error("Qualia2D: Physics Init Failure", err);
    }
  }

  /**
   * Advances simulation using a fixed-frequency sub-stepping accumulator.
   * [HtT]: Decouples simulation logic from rendering frame rate.
   */
  step(dtSeconds: number) {
    if (!this.world || !this.eventQueue) return;

    // Cap delta to prevent "Spiral of Death"
    this.accumulator += Math.min(dtSeconds, 0.1); 

    let subSteps = 0;
    while (this.accumulator >= this.FIXED_TIMESTEP) {
      // // CoT: Cache states for ALL rigid bodies (including fixed) before step
      this.syncToPrevious();
      
      this.world.step(this.eventQueue);
      this.accumulator -= this.FIXED_TIMESTEP;
      
      if (++subSteps > 5) {
        this.accumulator = 0; 
        break; 
      }
    }

    // Alpha is the fractional step between prev and current state
    this.interpolationAlpha.set(Math.max(0, Math.min(1, this.accumulator / this.FIXED_TIMESTEP)));
  }

  /**
   * Synchronizes current ECS transform to 'prev' state for interpolation.
   * [RUN_OPT]: Included all bodies to prevent "jittering" or missing static entities on frame transitions.
   */
  private syncToPrevious() {
    this.store.rigidBodies.forEach((rb, id) => {
      const ecsT = this.store.getTransform(id);
      if (ecsT) {
        ecsT.prevX = ecsT.x;
        ecsT.prevY = ecsT.y;
        ecsT.prevRotation = ecsT.rotation;
      }
    });
  }

  /**
   * Pushes latest WASM state to ECS transforms.
   */
  syncTransformsToECS() {
    if (!this.world) return;
    this.store.rigidBodies.forEach((rb, id) => {
        // Sync dynamic bodies as they move via forces
        if (rb.bodyType === 'dynamic' || rb.bodyType === 'kinematic') {
            const t = rb.handle.translation();
            const r = rb.handle.rotation();
            const ecsT = this.store.getTransform(id);
            if (ecsT) {
                ecsT.x = t.x; 
                ecsT.y = t.y; 
                ecsT.rotation = r;
            }
        }
    });
  }

  pickEntityAt(x: number, y: number, radius = 0.1): EntityId | null {
    if (!this.world || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    let selectedId: EntityId | null = null;
    const point = { x, y };

    const queryShape = radius === 0.1 && this.pickingSphere ? this.pickingSphere : new RAPIER.Ball(radius);
    
    this.world.intersectionsWithShape(point, 0, queryShape, (collider) => {
        for (const [id, col] of this.store.colliders) {
            if (col.handle === collider) { selectedId = id; return false; }
        }
        return true;
    });

    return selectedId;
  }

  createBody(id: EntityId, type: 'dynamic' | 'fixed', x: number, y: number): RAPIER.RigidBody | null {
    if (!this.world || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    const desc = type === 'dynamic' ? RAPIER.RigidBodyDesc.dynamic() : RAPIER.RigidBodyDesc.fixed();
    desc.setTranslation(x, y);
    const handle = this.world.createRigidBody(desc);
    this.store.rigidBodies.set(id, { handle, bodyType: type });
    return handle;
  }

  createCollider(id: EntityId, bodyHandle: RAPIER.RigidBody, w: number, h: number, shape: 'cuboid' | 'ball' = 'cuboid'): RAPIER.Collider | null {
    if (!this.world || !Number.isFinite(w) || !Number.isFinite(h)) return null;
    
    let desc;
    if (shape === 'ball') {
        desc = RAPIER.ColliderDesc.ball(Math.max(0.01, w / 2));
    } else {
        desc = RAPIER.ColliderDesc.cuboid(Math.max(0.01, w / 2), Math.max(0.01, h / 2));
    }

    const handle = this.world.createCollider(desc, bodyHandle);
    this.store.colliders.set(id, { handle, shape });
    return handle;
  }
  
  reset() {
      if(this.world) {
        this.world.free();
        this.world = new RAPIER.World({ x: 0.0, y: -9.81 });
        this.accumulator = 0;
      }
  }
}
