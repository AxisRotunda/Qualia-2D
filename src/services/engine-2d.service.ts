import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService, ControllerTopology } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Physics2DService } from './physics-2d.service';
import { Renderer2DService } from './renderer-2d.service';
import { GameLoopService } from '../engine/runtime/game-loop.service';
import { EntityGenerator, EntityId } from '../engine/ecs/entity';
import type { ScenePreset2D } from '../engine/scene.types';
import * as RAPIER from '@dimforge/rapier2d-compat';

export interface EntityTemplate {
  id: string;
  name: string;
  category: 'primitive' | 'dynamic' | 'force';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class Engine2DService {
  readonly state = inject(EngineState2DService);
  readonly ecs = inject(ComponentStoreService);
  public physics = inject(Physics2DService);
  private renderer = inject(Renderer2DService);
  private loop = inject(GameLoopService);

  readonly currentScene = signal<ScenePreset2D | null>(null);
  
  readonly templates: EntityTemplate[] = [
    { id: 'box_static', name: 'Static Box', category: 'primitive', icon: 'M4 4h16v16H4z' },
    { id: 'box_dynamic', name: 'Dynamic Box', category: 'dynamic', icon: 'M21 8V16L12 21L3 16V8L12 3L21 8Z' },
    { id: 'gravity_well', name: 'Gravity Well', category: 'force', icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' },
    { id: 'sensor_area', name: 'Trigger Zone', category: 'primitive', icon: 'M12 3v18M3 12h18' }
  ];

  async init(canvas: HTMLCanvasElement, initialScene: ScenePreset2D) {
    this.renderer.attach(canvas);
    await this.physics.init();
    this.loadScene(initialScene);
    this.loop.start((dt) => this.tick(dt));
  }

  loadScene(scene: ScenePreset2D) {
    this.state.setLoading(true);
    this.state.mode.set('edit');
    this.state.isPaused.set(false);
    this.state.isDragging.set(false);
    this.state.dragTargetPos.set(null);
    
    this.physics.reset();
    this.ecs.clear();
    EntityGenerator.reset();
    
    setTimeout(() => {
        scene.load(this);
        this.currentScene.set(scene);
        this.state.setLoading(false);
    }, 50);
  }

  private tick(dt: number) {
    const dtSeconds = dt / 1000;
    
    if (this.state.mode() === 'play' && !this.state.isPaused()) {
        const start = performance.now();
        if (this.physics.world) {
            
            // 1. Apply Environment Rules (Topology)
            this.applyTopologyRules(dtSeconds);

            // 2. Apply ECS Forces
            this.applyForces(dtSeconds);
            this.applyDraggingForces(dtSeconds);
            
            // 3. Player Controller
            this.handlePlayerInput(dtSeconds);
        }
        this.physics.step(dtSeconds); 
        this.physics.syncTransformsToECS();
        this.state.setPhysicsTime(performance.now() - start);
    }
    this.renderer.render();
    this.state.setFps(1000 / (dt || 1));
  }

  private applyTopologyRules(dt: number) {
    if (!this.physics.world) return;
    const topo = this.state.topology();

    if (topo === 'platformer') {
      // Classic gravity
      this.physics.world.gravity = { x: 0, y: this.state.gravityY() };
    } else if (topo === 'top-down-rpg') {
      // Zero gravity, Extreme friction (No sliding)
      this.physics.world.gravity = { x: 0, y: 0 };
      this.applyGlobalDamping(dt, 0.80); 
    } else if (topo === 'top-down-action') {
      // Zero gravity, Low friction (Drifting)
      this.physics.world.gravity = { x: 0, y: 0 };
      this.applyGlobalDamping(dt, 0.95);
    }
  }

  private applyGlobalDamping(dt: number, factor: number) {
    this.ecs.rigidBodies.forEach((rb) => {
      if (rb.bodyType === 'dynamic') {
        const vel = rb.handle.linvel();
        const angVel = rb.handle.angvel();
        
        // Apply manual damping to simulate surface friction
        rb.handle.setLinvel({ x: vel.x * factor, y: vel.y * factor }, true);
        rb.handle.setAngvel(angVel * factor, true);
      }
    });
  }

  private handlePlayerInput(dt: number) {
    const selectedId = this.state.selectedEntityId();
    if (!selectedId) return;

    const rb = this.ecs.rigidBodies.get(selectedId);
    if (!rb || rb.bodyType !== 'dynamic') return;

    const keys = this.state.keys();
    const topo = this.state.topology();
    let moveX = 0;
    let moveY = 0;

    if (keys.has('w') || keys.has('arrowup')) moveY += 1;
    if (keys.has('s') || keys.has('arrowdown')) moveY -= 1;
    if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
    if (keys.has('d') || keys.has('arrowright')) moveX += 1;

    // --- CONTROLLER ARCHETYPES ---

    // 1. PLATFORMER (Side View, Jump, Fixed Rotation)
    if (topo === 'platformer') {
       rb.handle.setRotation(0, true); // Lock rotation
       const impulse = 40.0 * dt;
       
       if (moveX !== 0) {
         rb.handle.applyImpulse({ x: moveX * impulse, y: 0 }, true);
       }
       
       // Jump Logic
       if (moveY > 0 && Math.abs(rb.handle.linvel().y) < 0.1) {
          rb.handle.applyImpulse({ x: 0, y: 8.0 }, true);
       }
    } 
    
    // 2. RPG (Top Down, Snappy, Fixed Rotation)
    else if (topo === 'top-down-rpg') {
       rb.handle.setRotation(0, true); // Lock rotation
       
       const speed = 15.0; // Target Velocity
       const currentVel = rb.handle.linvel();
       
       if (moveX !== 0 || moveY !== 0) {
         // Normalize input
         const mag = Math.sqrt(moveX*moveX + moveY*moveY);
         const targetX = (moveX / mag) * speed;
         const targetY = (moveY / mag) * speed;
         
         // Direct Velocity Set for "Snappy" feel (RPG Maker style)
         // We use interpolation to avoid physics glitching, but it's very tight
         const lerp = 0.2;
         rb.handle.setLinvel({ 
            x: currentVel.x + (targetX - currentVel.x) * lerp, 
            y: currentVel.y + (targetY - currentVel.y) * lerp 
         }, true);
       }
    }

    // 3. ACTION (Top Down, Drift, Mouse Look)
    else if (topo === 'top-down-action') {
       // Look At Mouse
       const t = this.ecs.getTransform(selectedId);
       if (t) {
         const dx = this.state.cursorWorldX() - t.x;
         const dy = this.state.cursorWorldY() - t.y;
         const angle = Math.atan2(dy, dx);
         rb.handle.setRotation(angle, true);
       }

       // Twin Stick Movement
       if (moveX !== 0 || moveY !== 0) {
          const thrust = 60.0 * dt;
          const mag = Math.sqrt(moveX*moveX + moveY*moveY);
          rb.handle.applyImpulse({ x: (moveX/mag)*thrust, y: (moveY/mag)*thrust }, true);
       }
    }
  }

  private applyForces(dt: number) {
    this.ecs.forceFields.forEach((field, fieldId) => {
      if (!field.active) return;
      const fieldTransform = this.ecs.getTransform(fieldId);
      if (!fieldTransform) return;

      this.ecs.rigidBodies.forEach((rb, entityId) => {
        if (rb.bodyType !== 'dynamic') return;
        const entityTransform = this.ecs.getTransform(entityId);
        if (!entityTransform) return;

        const dx = fieldTransform.x - entityTransform.x;
        const dy = fieldTransform.y - entityTransform.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = field.radius * field.radius;

        if (distSq < radiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const forceMag = (field.strength * dt) / (distSq + 0.5);
          const fx = (dx / dist) * forceMag;
          const fy = (dy / dist) * forceMag;
          rb.handle.applyImpulse({ x: fx, y: fy }, true);
        }
      });
    });
  }

  private applyDraggingForces(dt: number) {
    const selectedId = this.state.selectedEntityId();
    const target = this.state.dragTargetPos();
    if (!this.state.isDragging() || !selectedId || !target) return;

    const rb = this.ecs.rigidBodies.get(selectedId);
    if (!rb || rb.bodyType !== 'dynamic') return;

    const currentPos = rb.handle.translation();
    const dx = target.x - currentPos.x;
    const dy = target.y - currentPos.y;

    const stiffness = 20.0;
    const maxVelocity = 50.0;

    let vx = dx * stiffness;
    let vy = dy * stiffness;

    const mag = Math.sqrt(vx*vx + vy*vy);
    if (mag > maxVelocity) {
      vx = (vx / mag) * maxVelocity;
      vy = (vy / mag) * maxVelocity;
    }

    rb.handle.setLinvel({ x: vx, y: vy }, true);
  }

  spawnFromTemplate(templateId: string, x = 0, y = 0) {
    switch(templateId) {
      case 'box_static': return this.spawnBox(x, y, '#475569', 2, 0.5, 'fixed');
      case 'box_dynamic': return this.spawnBox(x, y, '#6366f1', 1, 1, 'dynamic');
      case 'gravity_well': return this.spawnGravityWell(x, y, 20, 5);
      case 'sensor_area': return this.spawnBox(x, y, 'rgba(16, 185, 129, 0.2)', 2, 2, 'fixed');
      default: return this.spawnBox(x, y);
    }
  }

  spawnGravityWell(x = 0, y = 0, strength = 20, radius = 5) {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.forceFields.set(id, { strength, radius, active: true });
    this.ecs.tags.set(id, { name: `GravityWell_${id}`, tags: new Set(['force_field']) });
    return id;
  }

  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic') {
    const id = EntityGenerator.generate();
    this.ecs.addEntity(id);
    this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
    this.ecs.sprites.set(id, { color, width: w, height: h, layer: 1, opacity: 1 });
    this.ecs.tags.set(id, { name: `${type === 'dynamic' ? 'Box' : 'Platform'}_${id}`, tags: new Set(['physics_object']) });
    
    const rb = this.physics.createBody(id, type, x, y);
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
      this.state.isDragging.set(false);
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
    
    if (this.state.mode() === 'edit') {
      if (t) { t.x = x; t.y = y; }
      if (rb) { rb.handle.setTranslation({ x, y }, true); }
    } else {
      this.state.dragTargetPos.set({ x, y });
    }
  }

  selectEntityAt(screenX: number, screenY: number, tolerance = 0): number | null {
    const worldPos = this.screenToWorld(screenX, screenY);
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
          if (dx*dx + dy*dy < (0.3 + tolerance) * (0.3 + tolerance)) {
            foundId = id;
            break;
          }
        }
      }
    }

    this.state.selectedEntityId.set(foundId);
    if (foundId) {
      this.state.isDragging.set(true);
      this.state.dragTargetPos.set(worldPos);
    }
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

  resetScene() {
    if (this.currentScene()) {
      this.loadScene(this.currentScene()!);
    }
  }

  togglePlay() {
    this.state.toggleMode();
    this.state.isDragging.set(false);
  }
}