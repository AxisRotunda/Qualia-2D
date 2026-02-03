import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { Camera2DService } from './camera-2d.service';
import { Input2DService } from './input-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { AssetRegistryService } from './asset-registry.service';
import { EntityId } from '../engine/ecs/entity';
import { EntityFactoryService } from '../engine/factory/entity-factory.service';
import { SceneManagerService } from './scene-manager.service';
import { Runtime2DService } from './runtime-2d.service';
import { Selection2DService } from './selection-2d.service';
import { ENTITY_TEMPLATES, EntityTemplate } from '../data/prefabs/entity-blueprints';
import type { ScenePreset2D } from '../engine/scene.types';

/**
 * High-Level Engine Orchestrator.
 * [RUN_REF]: Acts as a Bridge following Modular Isolation (P <= 3).
 */
@Injectable({ providedIn: 'root' })
export class Engine2DService {
  // Logic Orchestrators
  readonly state = inject(EngineState2DService);
  readonly camera = inject(Camera2DService);
  readonly input = inject(Input2DService);
  readonly ecs = inject(ComponentStoreService);
  readonly physics = inject(Physics2DService);
  readonly sceneManager = inject(SceneManagerService);
  readonly renderer = inject(Renderer2DService);
  readonly factory = inject(EntityFactoryService);
  readonly assets = inject(AssetRegistryService);

  private loop = inject(GameLoopService);
  private runtime = inject(Runtime2DService);
  private selection = inject(Selection2DService);

  readonly templates: EntityTemplate[] = ENTITY_TEMPLATES;

  async init(canvas: HTMLCanvasElement, initialScene: ScenePreset2D) {
    this.renderer.attach(canvas);
    await this.physics.init();
    await this.assets.loadDefaults(); 
    await this.loadScene(initialScene);
    
    // Start the game loop with the specialized runtime tick
    this.loop.start((dt) => this.runtime.tick(dt));
  }

  async loadScene(scene: ScenePreset2D) {
    await this.sceneManager.transitionTo(scene, this);
    const entities = this.ecs.entitiesList();
    const playerId = entities.find(id => this.ecs.players.has(id));
    if (playerId) this.camera.followedEntityId.set(playerId);
  }

  // --- Entity Management ---

  spawnFromTemplate(templateId: string, x = 0, y = 0) {
    return this.factory.spawnFromTemplate(templateId, x, y);
  }

  spawnAtCamera(templateId: string) {
    const followId = this.camera.followedEntityId();
    const t = followId !== null ? this.ecs.getTransform(followId) : null;
    const x = t ? t.x : this.camera.x();
    const y = t ? t.y + 2 : this.camera.y() + 5;
    return this.spawnFromTemplate(templateId, x, y);
  }

  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic') {
    return this.factory.spawnBox(x, y, color, w, h, type);
  }

  deleteEntity(id: EntityId) {
    const rb = this.ecs.rigidBodies.get(id);
    if (rb && this.physics.world) {
      this.physics.world.removeRigidBody(rb.handle);
    }
    this.ecs.removeEntity(id);
    
    if (this.state.selectedEntityId() === id) {
      this.selection.clearSelection();
    }
    if (this.camera.followedEntityId() === id) {
      this.camera.followedEntityId.set(null);
    }
  }

  // --- Mutation Facade ---

  updateSpriteColor(id: EntityId, color: string) {
    const s = this.ecs.sprites.get(id);
    if (s) s.color = color;
  }

  updateEntityName(id: EntityId, name: string) {
    const tag = this.ecs.tags.get(id);
    if (tag) tag.name = name;
  }

  updateEntitySize(id: EntityId, width: number, height: number) {
    const s = this.ecs.sprites.get(id);
    const rb = this.ecs.rigidBodies.get(id);
    const col = this.ecs.colliders.get(id);
    
    if (s) { s.width = width; s.height = height; }
    if (rb && col && this.physics.world) {
      this.physics.world.removeCollider(col.handle, true);
      const newCol = this.physics.createCollider(id, rb.handle, width, height);
      if (newCol) this.ecs.colliders.set(id, { handle: newCol, shape: 'cuboid' });
    }
  }

  setEntityPosition(id: EntityId, x: number, y: number) {
    const t = this.ecs.transforms.get(id);
    const rb = this.ecs.rigidBodies.get(id);
    if (this.state.mode() === 'edit') {
      if (t) { t.x = x; t.y = y; }
      if (rb) { rb.handle.setTranslation({ x, y }, true); }
    } else {
      this.input.dragTargetPos.set({ x, y });
    }
  }

  // --- Interaction Facade ---

  selectEntityAt(screenX: number, screenY: number): number | null {
    return this.selection.selectAt(screenX, screenY);
  }

  resetScene() {
    const current = this.sceneManager.currentScene();
    if (current) this.loadScene(current);
  }

  togglePlay() {
    this.state.toggleMode();
    this.input.setDragging(false);
  }
}