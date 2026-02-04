import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { RenderSystem } from '../engine/systems/render-system';
import { ControllerSystem2DService } from '../engine/systems/controller-system.service';
import { PlayerSystem } from '../engine/systems/player-system';
import { PhysicsSystem2DService } from '../engine/systems/physics-system.service';
import { AnimationSystem } from '../engine/systems/animation-system';
import { InteractionSystem } from '../engine/systems/interaction-system';

/**
 * Qualia2D Tick Orchestrator.
 * [REALISM]: Enforces fixed-frequency physics with interpolated rendering.
 */
@Injectable({ providedIn: 'root' })
export class Runtime2DService {
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);
  private renderer = inject(RenderSystem);
  private controllers = inject(ControllerSystem2DService);
  private playerSystem = inject(PlayerSystem);
  private physicsSystem = inject(PhysicsSystem2DService);
  private animation = inject(AnimationSystem);
  private interaction = inject(InteractionSystem);

  tick(dtMs: number) {
    const dtSeconds = dtMs / 1000;
    
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
      const start = performance.now();
      
      // 1. Advance Deterministic Physics (Fixed Timestep)
      if (this.physics.world) {
        this.controllers.applyTopologyRules(dtSeconds);
        this.physicsSystem.applyForces(dtSeconds);
        this.physicsSystem.applyDraggingForces(dtSeconds);
        
        this.playerSystem.update(dtSeconds);
        this.interaction.update(dtSeconds);
        
        // CoT: Step Advancements + Alpha Generation
        this.physics.step(dtSeconds); 
        this.physics.syncTransformsToECS();
      }
      
      // 2. Systems decoupled from physics frequency
      this.animation.update(dtSeconds);

      // 3. Status Telemetry
      this.state.setPhysicsTime(performance.now() - start);

      // 4. Camera Smoothing (Predictive Follow)
      const followId = this.camera.followedEntityId();
      if (followId !== null) {
        const t = this.ecs.getTransform(followId);
        if (t) this.camera.updateFollow(t.x, t.y, dtSeconds);
      }
    }
    
    // 5. Render Pass (Always consumes physics interpolation alpha)
    this.renderer.render();
    this.state.setFps(1000 / (dtMs || 1));
  }
}