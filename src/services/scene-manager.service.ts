import { Injectable, inject, signal, computed } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { EntityGenerator } from '../engine/ecs/entity';
import type { ScenePreset2D } from '../engine/scene.types';
import type { Engine2DService } from './engine-2d.service';

@Injectable({ providedIn: 'root' })
export class SceneManagerService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);

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
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      if (this.currentScene()?.onExit) this.currentScene()?.onExit!(engine);
      this.physics.reset();
      this.ecs.clear();
      EntityGenerator.reset();
      this.state.selectedEntityId.set(null);
      if (scene.preferredTopology) this.state.setTopology(scene.preferredTopology);
      await new Promise(resolve => requestAnimationFrame(resolve));
      scene.load(engine);
      if (scene.onEnter) scene.onEnter(engine);
      this.currentScene.set(scene);
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      this.state.setLoading(false);
      this.isTransitioning.set(false);
    }
  }
}