
import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { Input2DService } from './input-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { PhysicsEngine } from '../engine/core/physics-engine.service';
import { RenderSystem } from '../engine/systems/render-system';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { AssetRegistryService } from '../engine/core/asset-registry.service';
import { SceneManagerService } from './scene-manager.service';
import { Runtime2DService } from './runtime-2d.service';
import { Selection2DService } from './selection-2d.service';
import { Mutation2DService } from './mutation-2d.service';
import { Spawner2DService } from './spawner-2d.service';
import { EntityFactoryService } from '../engine/factory/entity-factory.service';
import { BLUEPRINTS, EntityBlueprint } from '../data/prefabs/entity-blueprints';
import type { ScenePreset2D } from '../engine/scene.types';
import { EntityId } from '../engine/ecs/entity';

/**
 * Qualia2D Primary Orchestrator Façade.
 * [RUN_REF]: Enforces modular isolation. UI interacts with this Bridge.
 */
@Injectable({ providedIn: 'root' })
export class Engine2DService {
  readonly state = inject(EngineState2DService);
  readonly camera = inject(Camera2DService);
  readonly input = inject(Input2DService);
  readonly ecs = inject(ComponentStoreService);
  readonly sceneManager = inject(SceneManagerService);
  readonly renderer = inject(RenderSystem);
  
  readonly mutation = inject(Mutation2DService);
  readonly spawner = inject(Spawner2DService);
  readonly factory = inject(EntityFactoryService);
  readonly loop = inject(GameLoopService);
  readonly runtime = inject(Runtime2DService);
  readonly selection = inject(Selection2DService);
  readonly assets = inject(AssetRegistryService);
  readonly physics = inject(PhysicsEngine);

  readonly templates: EntityBlueprint[] = BLUEPRINTS;

  async init(canvas: HTMLCanvasElement, initialScene: ScenePreset2D) {
    this.renderer.attach(canvas);
    await this.physics.init();
    await this.assets.loadDefaults(); 
    await this.loadScene(initialScene);
    this.loop.start((dt) => this.runtime.tick(dt));
  }

  async loadScene(scene: ScenePreset2D) {
    await this.sceneManager.transitionTo(scene, this);
    const entities = this.ecs.entitiesList();
    const playerId = entities.find(id => this.ecs.players.has(id));
    if (playerId) this.camera.followedEntityId.set(playerId);
  }

  spawnFromTemplate(templateId: string, x = 0, y = 0) { return this.spawner.spawnFromTemplate(templateId, x, y); }
  spawnAtCamera(templateId: string) { return this.spawner.spawnAtCamera(templateId); }

  // Added spawnBox to facade per RUN_REF consolidation
  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic') {
    return this.spawner.spawnBox(x, y, color, w, h, type);
  }
  
  deleteEntity(id: EntityId) { this.mutation.deleteEntity(id); }
  updateSpriteColor(id: EntityId, color: string) { this.mutation.updateSpriteColor(id, color); }
  updateEntityName(id: EntityId, name: string) { this.mutation.updateEntityName(id, name); }
  updateEntitySize(id: EntityId, w: number, h: number) { this.mutation.updateEntitySize(id, w, h); }
  setEntityPosition(id: EntityId, x: number, y: number) { this.mutation.setEntityPosition(id, x, y); }

  selectEntityAt(screenX: number, screenY: number) { return this.selection.selectAt(screenX, screenY); }
  resetScene() { const current = this.sceneManager.currentScene(); if (current) this.loadScene(current); }
  togglePlay() { this.state.toggleMode(); this.input.setDragging(false); }

  /**
   * [RUN_UI] Focus camera on a specific entity.
   */
  focusEntity(id: EntityId) {
    const t = this.ecs.getTransform(id);
    if (t) {
      this.camera.setAt(t.x, t.y);
      this.camera.followedEntityId.set(null); // Break any existing follow
    }
  }
}
