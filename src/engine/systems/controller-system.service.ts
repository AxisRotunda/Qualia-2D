import { Injectable, inject, effect } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { CommandRegistryService } from '../../services/command-registry.service';
import { TOPOLOGY_BEHAVIORS } from '../../data/config/topology-config';

/**
 * Controller Orchestration System.
 * [RUN_REF]: Focused on global topology and environment calibration.
 */
@Injectable({ providedIn: 'root' })
export class ControllerSystem2DService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);
  private commands = inject(CommandRegistryService);

  constructor() {
    effect(() => {
        const top = this.state.topology();
        this.commands.execute('RUN_PHYS', `TOPOLOGY_SHIFT: ${top}`);
    });
  }

  /**
   * Applies global environment rules (gravity, damping) based on active topology.
   */
  applyTopologyRules(dt: number) {
    if (!this.physics.world) return;
    
    const currentTopology = this.state.topology();
    const rules = TOPOLOGY_BEHAVIORS[currentTopology](this.state.gravityY());
    
    // 1. Sync World Gravity
    this.physics.world.gravity = rules.gravity;

    // 2. Apply Global Damping (Frame-Rate Independent)
    if (rules.damping > 0) {
      const dampFactor = Math.pow(rules.damping, dt * 60);
      this.ecs.rigidBodies.forEach((rb) => {
        // Only apply global damping to dynamic objects that ARE NOT the player 
        // (Player has its own refined damping/acceleration in PlayerSystem)
        if (rb.bodyType === 'dynamic') {
          const vel = rb.handle.linvel();
          const angVel = rb.handle.angvel();
          rb.handle.setLinvel({ x: vel.x * dampFactor, y: vel.y * dampFactor }, true);
          rb.handle.setAngvel(angVel * dampFactor, true);
        }
      });
    }
  }
}