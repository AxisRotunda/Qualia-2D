
import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { EntityGenerator, EntityId } from '../engine/ecs/entity';
import type { ScenePreset2D } from '../engine/scene.types';
import * as RAPIER from '@dimforge/rapier2d-compat';

@Injectable({ providedIn: 'root' })
export class Engine2DService {
  readonly state = inject(EngineState2DService);
  readonly ecs = inject(ComponentStoreService);
  public physics = inject(Physics2DService);
  private renderer = inject(Renderer2DService);
  private loop = inject(GameLoopService);

  readonly currentScene = signal<ScenePreset2D | null>(null);

  async init(canvas: HTMLCanvasElement, initialScene: ScenePreset2D) {
    this.renderer.attach(canvas);
    await this.physics.init();
    
    // Load initial scene
    this.loadScene(initialScene);
    
    this.loop.start((dt) => this.tick(dt));
  }

  loadScene(scene: ScenePreset2D) {
    this.state.setLoading(true);
    this.state.mode.set('edit');
    this.state.isPaused.set(false);
    
    // Reset World
    this.physics.reset();
    this.ecs.clear();
    EntityGenerator.reset();
    
    // Slight delay to allow UI to show loading state and clear stack
    setTimeout(() => {
        scene.load(this);
        this.currentScene.set(scene);
        this.state.setLoading(false);
    }, 50);
  }

  private tick(dt: number) {
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
        const start = performance.now();
        // Update gravity if it changed
        if (this.physics.world) {
            this.physics.world.gravity = { x: 0, y: this.state.gravityY() };
        }
        this.physics.step(dt / 1000); 
        this.physics.syncTransformsToECS();
        this.state.setPhysicsTime(performance.now() - start);
    }
    this.renderer.render();
    this.state.setFps(1000 / (dt || 1));
  }

  togglePlay() {
    this.state.toggleMode();
  }

  resetScene() {
    const s = this.currentScene();
    if (s) this.loadScene(s);
  }

  spawnBox(x = (Math.random() - 0.5) * 5, y = 5 + Math.random() * 5, color = '#60a5fa', w = 1, h = 1) {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color, width: w, height: h, layer: 1, opacity: 1 });
    this.ecs.tags.set(id, { name: `Box_${id}`, tags: new Set(['physics_object']) });
    
    const rb = this.physics.createBody(id, 'dynamic', x, y);
    if (rb) this.physics.createCollider(id, rb, w, h);
    return id;
  }

  deleteEntity(id: EntityId) {
    const rb = this.ecs.rigidBodies.get(id);
    if (rb && this.physics.world) {
      this.physics.world.removeRigidBody(rb.handle);
    }
    this.ecs.removeEntity(id);
    if (this.state.selectedEntityId() === id) {
      this.state.selectedEntityId.set(null);
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
    
    if (s) {
      s.width = width;
      s.height = height;
    }

    // Re-create collider if physics exists
    if (rb && col && this.physics.world) {
      this.physics.world.removeCollider(col.handle, true);
      const newCol = this.physics.createCollider(id, rb.handle, width, height);
      if (newCol) {
        this.ecs.colliders.set(id, { handle: newCol, shape: 'cuboid' });
      }
    }
  }

  setEntityPosition(id: EntityId, x: number, y: number) {
    const t = this.ecs.transforms.get(id);
    const rb = this.ecs.rigidBodies.get(id);
    if (t) {
      t.x = x;
      t.y = y;
    }
    if (rb) {
      rb.handle.setTranslation({ x, y }, true);
    }
  }

  selectEntityAt(screenX: number, screenY: number): number | null {
    const zoom = this.state.cameraZoom();
    const camX = this.state.cameraX();
    const camY = this.state.cameraY();
    const halfW = this.renderer.width / 2;
    const halfH = this.renderer.height / 2;

    const worldX = (screenX - halfW) / zoom + camX;
    const worldY = -((screenY - halfH) / zoom - camY);

    let foundId: number | null = null;
    const entities = this.ecs.entitiesList();
    for (let i = entities.length - 1; i >= 0; i--) {
        const id = entities[i];
        const t = this.ecs.getTransform(id);
        const s = this.ecs.getSprite(id);
        if (t && s) {
            const minX = t.x - s.width / 2;
            const maxX = t.x + s.width / 2;
            const minY = t.y - s.height / 2;
            const maxY = t.y + s.height / 2;
            if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
                foundId = id;
                break;
            }
        }
    }
    this.state.selectedEntityId.set(foundId);
    if (foundId) this.state.setActivePanel('inspector');
    return foundId;
  }

  screenToWorld(screenX: number, screenY: number) {
    const zoom = this.state.cameraZoom();
    const camX = this.state.cameraX();
    const camY = this.state.cameraY();
    const halfW = this.renderer.width / 2;
    const halfH = this.renderer.height / 2;

    return {
        x: (screenX - halfW) / zoom + camX,
        y: -((screenY - halfH) / zoom - camY)
    };
  }
}
