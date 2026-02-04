
import { Injectable, inject, signal, computed } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { EntityGenerator } from '../engine/ecs/entity';
import type { ScenePreset2D } from '../engine/scene.types';
import type { Engine2DService } from './engine-2d.service';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class SceneManagerService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);
  private project = inject(ProjectService);

  readonly currentScene = signal<ScenePreset2D | null>(null);
  readonly isTransitioning = signal(false);

  readonly sceneMetrics = computed(() => {
    const scene = this.currentScene();
    if (!scene) return null;
    return {
      name: scene.name,
      entities: this.ecs.entityCount(),
      physicsNodes: this.ecs.rigidBodies.size,
      complexity: scene.complexity
    };
  });

  async transitionTo(scene: ScenePreset2D, engine: Engine2DService) {
    if (this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.state.setLoading(true);
    // Yield to browser for UI update
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      if (this.currentScene()?.onExit) this.currentScene()?.onExit!(engine);
      this.physics.reset();
      this.ecs.clear();
      EntityGenerator.reset();
      this.state.selectedEntityId.set(null);
      
      // [PROTOCOL_PROJECT] Apply Merged Configuration (Defaults + Project Overrides)
      const mergedConfig = this.project.getMergedSceneConfig(scene);

      // [PROTOCOL_TOPOLOGY_V2.0] Strict Binding
      if (mergedConfig.topology) {
        this.state.setTopology(mergedConfig.topology);
      } else if (scene.preferredTopology) {
        // Fallback to template preference if config is partial
        this.state.setTopology(scene.preferredTopology);
      }
      
      // Apply Environment
      this.state.setEnvironment(mergedConfig.env);
      
      // Apply Physics Config
      if (mergedConfig.physics) {
        this.state.gravityY.set(mergedConfig.physics.gravity.y);
      }
      
      // Update Project Reference
      this.project.updateLastScene(scene.id);
      
      // Yield to ensure cleanup is rendered/processed
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Load Scene (Supports Async/Streaming)
      await scene.load(engine);
      
      if (scene.onEnter) scene.onEnter(engine);
      this.currentScene.set(scene);
      
      // Short delay for aesthetic stabilization
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      this.state.setLoading(false);
      this.isTransitioning.set(false);
    }
  }
}