
import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { EntityGenerator, EntityId } from '../engine/ecs/entity';

@Injectable({ providedIn: 'root' })
export class Engine2DService {
  readonly state = inject(EngineState2DService);
  readonly ecs = inject(ComponentStoreService);
  private physics = inject(Physics2DService);
  private renderer = inject(Renderer2DService);
  private loop = inject(GameLoopService);

  async init(canvas: HTMLCanvasElement) {
    this.renderer.attach(canvas);
    await this.physics.init();
    this.loadPlayground();
    this.state.setLoading(false);
    this.loop.start((dt) => this.tick(dt));
  }

  private tick(dt: number) {
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
        const start = performance.now();
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
    this.physics.reset();
    this.ecs.clear();
    EntityGenerator.reset();
    this.loadPlayground();
    this.state.mode.set('edit');
    this.state.selectedEntityId.set(null);
  }

  spawnBox(x = (Math.random() - 0.5) * 5, y = 5 + Math.random() * 5, color = '#60a5fa') {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color, width: 1, height: 1, layer: 1, opacity: 1 });
    this.ecs.tags.set(id, { name: `Box_${id}`, tags: new Set(['physics_object']) });
    
    const rb = this.physics.createBody(id, 'dynamic', x, y);
    this.physics.createCollider(id, rb!, 1, 1);
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

  selectEntityAt(screenX: number, screenY: number) {
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
  }

  private loadPlayground() {
    const floorId = EntityGenerator.generate();
    this.ecs.addEntity(floorId);
    this.ecs.transforms.set(floorId, { x: 0, y: -5, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(floorId, { color: '#475569', width: 20, height: 2, layer: 0, opacity: 1 });
    this.ecs.tags.set(floorId, { name: 'Ground', tags: new Set(['static']) });
    const floorRb = this.physics.createBody(floorId, 'fixed', 0, -5);
    this.physics.createCollider(floorId, floorRb!, 20, 2);
    
    this.spawnBox(-2, 2, '#fbbf24');
    this.spawnBox(2, 4, '#ef4444');
  }
}
