import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { CommandRegistryService } from '../../services/command-registry.service';
import { TOPOLOGY_BEHAVIORS } from '../../data/config/topology-config';

// Controller System Configuration
const CONTROLLER_CONFIG = {
  TARGET_FPS: 60,
  DAMPING: {
    MIN_FACTOR: 0.01,
    MAX_FACTOR: 1.0,
    EPSILON: 1e-6, // Threshold for considering velocity effectively zero
  },
  DELTA_TIME: {
    MIN: 0,
    MAX: 1.0, // Maximum acceptable dt (1 second) to prevent physics explosions
  },
} as const;

/**
 * Controller Orchestration System V3.0
 * [ENHANCED]: Memory-safe effects, frame-rate independent damping, validation guards
 * 
 * Responsibilities:
 * - Topology-based physics rule application
 * - Frame-rate independent damping calculations
 * - Global velocity damping for all dynamic rigid bodies
 */
@Injectable({ providedIn: 'root' })
export class ControllerSystem2DService {
  private readonly state = inject(EngineState2DService);
  private readonly ecs = inject(ComponentStoreService);
  private readonly physics = inject(PhysicsEngine);
  private readonly commands = inject(CommandRegistryService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeTopologyTracking();
  }

  /**
   * Initializes memory-safe topology change tracking
   */
  private initializeTopologyTracking(): void {
    const topologyEffect = effect(() => {
      const topology = this.state.topology();
      this.commands.execute('RUN_PHYS', `TOPOLOGY_SHIFT: ${topology}`);
    });

    this.destroyRef.onDestroy(() => {
      topologyEffect.destroy();
    });
  }

  /**
   * Applies topology-specific physics rules and global damping
   * @param dt - Delta time in seconds
   */
  applyTopologyRules(dt: number): void {
    // Validation guards
    if (!this.physics.world) return;
    if (!this.isValidDeltaTime(dt)) return;
    
    const currentTopology = this.state.topology();
    const rules = TOPOLOGY_BEHAVIORS[currentTopology](this.state.gravityY());
    
    // Phase 1: Synchronize World Gravity
    this.physics.world.gravity = rules.gravity;

    // Phase 2: Apply Frame-Rate Independent Damping
    if (rules.damping > 0) {
      const dampingFactor = this.calculateDampingFactor(rules.damping, dt);
      this.applyDampingToRigidBodies(dampingFactor);
    }
  }

  /**
   * Validates delta time to prevent physics instability
   */
  private isValidDeltaTime(dt: number): boolean {
    return dt > CONTROLLER_CONFIG.DELTA_TIME.MIN && 
           dt <= CONTROLLER_CONFIG.DELTA_TIME.MAX;
  }

  /**
   * Calculates frame-rate independent damping factor
   * Uses exponential decay: factor = damping^(dt * TARGET_FPS)
   */
  private calculateDampingFactor(damping: number, dt: number): number {
    const normalizedDt = dt * CONTROLLER_CONFIG.TARGET_FPS;
    const dampFactor = Math.pow(damping, normalizedDt);
    
    // Clamp to safe range to prevent numerical instability
    return Math.max(
      CONTROLLER_CONFIG.DAMPING.MIN_FACTOR,
      Math.min(CONTROLLER_CONFIG.DAMPING.MAX_FACTOR, dampFactor)
    );
  }

  /**
   * Applies velocity damping to all dynamic rigid bodies
   * @param dampFactor - Multiplicative damping factor (0-1 range)
   */
  private applyDampingToRigidBodies(dampFactor: number): void {
    this.ecs.rigidBodies.forEach((rb) => {
      if (rb.bodyType !== 'dynamic' || !rb.handle) return;

      const vel = rb.handle.linvel();
      if (!vel) return;

      // Apply linear damping
      rb.handle.setLinvel({ 
        x: vel.x * dampFactor, 
        y: vel.y * dampFactor 
      }, true);
      
      // Apply angular damping (if angular velocity exists)
      const angVel = rb.handle.angvel();
      if (angVel !== undefined && angVel !== null) {
        // Only apply if velocity is above epsilon to avoid floating-point drift
        if (Math.abs(angVel) > CONTROLLER_CONFIG.DAMPING.EPSILON) {
          rb.handle.setAngvel(angVel * dampFactor, true);
        }
      }
    });
  }
}
