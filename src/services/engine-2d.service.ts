
import { Injectable, computed } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { EntityGenerator } from '../engine/ecs/entity';

@Injectable({ providedIn: 'root' })
export class Engine2DService {
  
  constructor(
    public state: EngineState2DService,
    private ecs: ComponentStoreService,
    private physics: Physics2DService,
    private renderer: Renderer2DService,
    private loop: GameLoopService
  ) {}

  async init(canvas: HTMLCanvasElement) {
    this.renderer.attach(canvas);
    await this.physics.init();
    
    // Setup initial scene content
    this.loadPlayground();
    
    this.state.setLoading(false);
    
    // Start Loop
    this.loop.start((dt) => this.tick(dt));
  }

  private tick(dt: number) {
    // 1. Logic (omitted for brevity)
    
    // 2. Physics
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
        const start = performance.now();
        // Fixed step simulation could be more sophisticated (accumulator)
        // For now, simple step
        this.physics.step(dt / 1000); 
        this.physics.syncTransformsToECS();
        this.state.setPhysicsTime(performance.now() - start);
    }

    // 3. Render
    this.renderer.render();
    
    // 4. Stats
    this.state.setFps(1000 / (dt || 1));
  }

  // --- Actions ---

  togglePlay() {
    // Sync transforms back to physics if we dragged things in edit mode?
    // For now, just toggle state
    this.state.toggleMode();
  }

  resetScene() {
    this.physics.reset();
    this.ecs.clear();
    EntityGenerator.reset();
    this.loadPlayground();
    this.state.mode.set('edit');
  }

  spawnBox() {
    const id = EntityGenerator.generate();
    const x = (Math.random() - 0.5) * 5;
    const y = 5 + Math.random() * 5;
    
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: Math.random(), scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color: '#60a5fa', width: 1, height: 1, layer: 1, opacity: 1 });
    
    const rb = this.physics.createBody(id, 'dynamic', x, y);
    this.physics.createCollider(id, rb, 1, 1);
  }

  selectEntityAt(screenX: number, screenY: number) {
    // Raycasting or simple distance check for this prototype
    // Convert screen to world
    const zoom = this.state.cameraZoom();
    const camX = this.state.cameraX();
    const camY = this.state.cameraY();
    const halfW = (this.renderer['width'] || 800) / 2;
    const halfH = (this.renderer['height'] || 600) / 2;

    const worldX = (screenX - halfW) / zoom + camX;
    const worldY = -((screenY - halfH) / zoom - camY); // Flipped Y

    // Find first entity containing point
    let foundId: number | null = null;
    for (const id of this.ecs.entities) {
        const t = this.ecs.getTransform(id);
        const s = this.ecs.getSprite(id);
        if (t && s) {
            // Simple AABB check assuming no rotation for selection logic simplicity
            const minX = t.x - s.width / 2;
            const maxX = t.x + s.width / 2;
            const minY = t.y - s.height / 2;
            const maxY = t.y + s.height / 2;
            
            if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
                foundId = id;
                break; // Top one? (Requires Z-sort)
            }
        }
    }
    
    this.state.selectedEntityId.set(foundId);
  }

  private loadPlayground() {
    // Floor
    const floorId = EntityGenerator.generate();
    this.ecs.addEntity(floorId);
    this.ecs.transforms.set(floorId, { x: 0, y: -5, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(floorId, { color: '#475569', width: 20, height: 2, layer: 0, opacity: 1 });
    const floorRb = this.physics.createBody(floorId, 'fixed', 0, -5);
    this.physics.createCollider(floorId, floorRb, 20, 2);

    // Initial Box
    this.spawnBox();
  }
}
