import { Injectable, inject, signal, computed } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { EntityGenerator } from '../engine/ecs/entity';
import type { ScenePreset2D } from '../engine/scene.types';
import type { Engine2DService } from './engine-2d.service';

@Injectable({ providedIn: 'root' })
export class SceneManagerService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(Physics2DService);

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

    // Ensure UI has a frame to show loading state before blocking
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      // 1. Exit Hook
      if (this.currentScene()?.onExit) {
        this.currentScene()?.onExit!(engine);
      }

      // 2. Clear & Reset (Memory Safety)
      this.physics.reset();
      this.ecs.clear();
      EntityGenerator.reset();
      this.state.selectedEntityId.set(null);

      // 3. Apply Preferred Topology
      if (scene.preferredTopology) {
        this.state.setTopology(scene.preferredTopology);
      }

      // 4. Load & Enter
      // Use another RAF to ensure the clear-out is processed
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      scene.load(engine);
      if (scene.onEnter) scene.onEnter(engine);
      
      this.currentScene.set(scene);
      
      // Artificial delay for smooth perceptual transition on high-speed loads
      await new Promise(resolve => setTimeout(resolve, 300));

    } finally {
      this.state.setLoading(false);
      this.isTransitioning.set(false);
    }
  }
}