// /src/engine/systems/controller-system.service.ts

import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { CommandRegistryService } from '../../services/command-registry.service';
import { TOPOLOGY_BEHAVIORS } from '../../data/config/topology-config';

/**
 * Controller Orchestration System V2.0
 * [ENHANCED]: Memory-safe effects, frame-rate independence constants
 */
@Injectable({ providedIn: 'root' })
export class ControllerSystem2DService {
  private readonly state = inject(EngineState2DService);
  private readonly ecs = inject(ComponentStoreService);
  private readonly physics = inject(PhysicsEngine);
  private readonly commands = inject(CommandRegistryService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly TARGET_FPS = 60;
  private readonly MIN_DAMPING_FACTOR = 0.01;
  private readonly MAX_DAMPING_FACTOR = 1.0;

  constructor() {
    const topologyEffect = effect(() => {
      const top = this.state.topology();
      this.commands.execute('RUN_PHYS', `TOPOLOGY_SHIFT: ${top}`);
    });

    this.destroyRef.onDestroy(() => {
      topologyEffect.destroy();
    });
  }

  applyTopologyRules(dt: number): void {
    if (!this.physics.world || dt <= 0 || dt > 1) return;
    
    const currentTopology = this.state.topology();
    const rules = TOPOLOGY_BEHAVIORS[currentTopology](this.state.gravityY());
    
    // 1. Sync World Gravity
    this.physics.world.gravity = rules.gravity;

    // 2. Apply Global Damping (Frame-Rate Independent)
    if (rules.damping > 0) {
      const normalizedDt = dt * this.TARGET_FPS;
      const dampFactor = Math.pow(
        rules.damping, 
        normalizedDt
      );
      
      const clampedDampFactor = Math.max(
        this.MIN_DAMPING_FACTOR,
        Math.min(this.MAX_DAMPING_FACTOR, dampFactor)
      );

      this.applyDampingToRigidBodies(clampedDampFactor);
    }
  }

  private applyDampingToRigidBodies(dampFactor: number): void {
    this.ecs.rigidBodies.forEach((rb) => {
      if (rb.bodyType !== 'dynamic' || !rb.handle) return;

      const vel = rb.handle.linvel();
      const angVel = rb.handle.angvel();
      
      if (!vel) return;

      rb.handle.setLinvel({ 
        x: vel.x * dampFactor, 
        y: vel.y * dampFactor 
      }, true);
      
      if (angVel !== undefined && angVel !== null) {
        rb.handle.setAngvel(angVel * dampFactor, true);
      }
    });
  }
}
