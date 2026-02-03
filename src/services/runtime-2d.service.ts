
import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { ControllerSystem2DService } from '../engine/systems/controller-system.service';
import { PhysicsSystem2DService } from '../engine/systems/physics-system.service';

@Injectable({ providedIn: 'root' })
export class Runtime2DService {
  private state = inject(EngineState2DService);
  private camera = inject(Camera2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(Physics2DService);
  private renderer = inject(Renderer2DService);
  private controllers = inject(ControllerSystem2DService);
  private physicsSystem = inject(PhysicsSystem2DService);

  /**
   * The core simulation tick.
   * [RUN_REF]: Isolated from the Engine orchestrator to reduce cyclomatic complexity.
   */
  tick(dt: number) {
    const dtSeconds = dt / 1000;
    
    // Only simulate if playing and not paused
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
      const start = performance.now();
      
      if (this.physics.world) {
        // 1. Pre-Step Systems
        this.controllers.applyTopologyRules(dtSeconds);
        this.physicsSystem.applyForces(dtSeconds);
        this.physicsSystem.applyDraggingForces(dtSeconds);
        this.controllers.update(dtSeconds);
        
        // 2. Solve Physics
        this.physics.step(dtSeconds); 
        
        // 3. Post-Step Sync
        this.physics.syncTransformsToECS();
      }

      this.state.setPhysicsTime(performance.now() - start);

      // 4. Camera Updates
      const followId = this.camera.followedEntityId();
      if (followId !== null) {
        const t = this.ecs.getTransform(followId);
        if (t) this.camera.updateFollow(t.x, t.y, dtSeconds);
      }
    }
    
    // 5. Drawing (Always happens regardless of play/edit mode)
    this.renderer.render();
    
    // 6. Metrics
    this.state.setFps(1000 / (dt || 1));
  }
}
