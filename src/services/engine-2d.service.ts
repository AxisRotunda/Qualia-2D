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
import { ControllerSystem2DService } from '../engine/systems/controller-system.service';
import { PhysicsSystem2DService } from '../engine/systems/physics-system.service';
import { SceneManagerService } from './scene-manager.service';
import type { ScenePreset2D } from '../engine/scene.types';

export interface EntityTemplate {
  id: string;
  name: string;
  category: 'primitive' | 'dynamic' | 'force';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class Engine2DService {
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
  private controllers = inject(ControllerSystem2DService);
  private physicsSystem = inject(PhysicsSystem2DService);

  readonly templates: EntityTemplate[] = [
    { id: 'box_static', name: 'Static Box', category: 'primitive', icon: 'M4 4h16v16H4z' },
    { id: 'box_dynamic', name: 'Dynamic Box', category: 'dynamic', icon: 'M21 8V16L12 21L3 16V8L12 3L21 8Z' },
    { id: 'gravity_well', name: 'Gravity Well', category: 'force', icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' },
    { id: 'sensor_area', name: 'Trigger Zone', category: 'primitive', icon: 'M12 3v18M3 12h18' }
  ];

  async init(canvas: HTMLCanvasElement, initialScene: ScenePreset2D) {
    this.renderer.attach(canvas);
    await this.physics.init();
    await this.assets.loadDefaults(); // Pre-load core textures
    await this.loadScene(initialScene);
    this.loop.start((dt) => this.tick(dt));
  }

  async loadScene(scene: ScenePreset2D) {
    await this.sceneManager.transitionTo(scene, this);
    const entities = this.ecs.entitiesList();
    const playerId = entities.find(id => this.ecs.players.has(id));
    if (playerId) this.camera.followedEntityId.set(playerId);
  }

  private tick(dt: number) {
    const dtSeconds = dt / 1000;
    
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
        const start = performance.now();
        if (this.physics.world) {
            this.controllers.applyTopologyRules(dtSeconds);
            this.physicsSystem.applyForces(dtSeconds);
            this.physicsSystem.applyDraggingForces(dtSeconds);
            this.controllers.update(dtSeconds);
        }
        this.physics.step(dtSeconds); 
        this.physics.syncTransformsToECS();
        this.state.setPhysicsTime(performance.now() - start);

        const followId = this.camera.followedEntityId();
        if (followId !== null) {
          const t = this.ecs.getTransform(followId);
          if (t) this.camera.updateFollow(t.x, t.y, dtSeconds);
        }
    }
    
    this.renderer.render();
    this.state.setFps(1000 / (dt || 1));
  }

  spawnFromTemplate(templateId: string, x = 0, y = 0) {
    return this.factory.spawnFromTemplate(templateId, x, y);
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
      this.state.selectedEntityId.set(null);
      this.input.setDragging(false);
    }
    if (this.camera.followedEntityId() === id) {
      this.camera.followedEntityId.set(null);
    }
  }

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

  selectEntityAt(screenX: number, screenY: number): number | null {
    const tolerance = this.input.interactionDevice() === 'touch' ? 0.6 : 0.05;
    const worldPos = this.camera.screenToWorld(screenX, screenY, this.renderer.width, this.renderer.height);
    let foundId = this.physics.pickEntityAt(worldPos.x, worldPos.y, tolerance);
    
    if (foundId === null) {
      const entities = this.ecs.entitiesList();
      for (let i = entities.length - 1; i >= 0; i--) {
        const id = entities[i];
        if (this.ecs.rigidBodies.has(id)) continue;
        const t = this.ecs.getTransform(id);
        const field = this.ecs.getForceField(id);
        if (t && field) {
          const dx = worldPos.x - t.x;
          const dy = worldPos.y - t.y;
          if (dx*dx + dy*dy < (tolerance + 0.3) * (tolerance + 0.3)) { foundId = id; break; }
        }
      }
    }

    this.state.selectedEntityId.set(foundId);
    if (foundId) {
      this.input.setDragging(true, worldPos);
    }
    return foundId;
  }

  resetScene() {
    if (this.sceneManager.currentScene()) {
      this.loadScene(this.sceneManager.currentScene()!);
    }
  }

  togglePlay() {
    this.state.toggleMode();
    this.input.setDragging(false);
  }
}