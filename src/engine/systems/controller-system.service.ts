import { Injectable, inject, effect } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { ComponentStoreService } from '../ecs/component-store.service';
import { PhysicsEngine } from '../core/physics-engine.service';
import { CommandRegistryService } from '../../services/command-registry.service';

@Injectable({ providedIn: 'root' })
export class ControllerSystem2DService {
  private state = inject(EngineState2DService);
  private input = inject(Input2DService);
  private ecs = inject(ComponentStoreService);
  private physics = inject(PhysicsEngine);
  private commands = inject(CommandRegistryService);

  constructor() {
    effect(() => {
        const top = this.state.topology();
        this.commands.execute('RUN_PHYS', `TOPOLOGY_SHIFT: ${top}`);
    });
  }

  update(dt: number) {
    this.updateInputVectors();

    this.ecs.players.forEach((config, id) => {
        const rb = this.ecs.rigidBodies.get(id);
        if (!rb || rb.bodyType !== 'dynamic') return;

        const topo = this.state.topology();
        const move = this.input.moveVector();
        const look = this.input.lookVector();

        if (topo === 'platformer') {
            rb.handle.setRotation(0, true);
            const impulse = config.speed * dt;
            if (move.x !== 0) {
              rb.handle.applyImpulse({ x: move.x * impulse, y: 0 }, true);
            }
            if (move.y > 0.5 && Math.abs(rb.handle.linvel().y) < 0.1) {
                rb.handle.applyImpulse({ x: 0, y: 12.0 }, true); 
            }
        } 
        else if (topo === 'top-down-rpg') {
            rb.handle.setRotation(0, true);
            const speed = config.speed;
            rb.handle.setLinvel({ x: move.x * speed, y: move.y * speed }, true);
        }
        else if (topo === 'top-down-action') {
            const t = this.ecs.getTransform(id);
            if (t) {
                let angle = t.rotation;
                if (this.input.isUsingJoypad() && (look.x !== 0 || look.y !== 0)) {
                    angle = Math.atan2(look.y, look.x);
                } else if (!this.input.isUsingJoypad()) {
                    const cursor = this.input.cursorWorld();
                    const dx = cursor.x - t.x;
                    const dy = cursor.y - t.y;
                    angle = Math.atan2(dy, dx);
                }
                rb.handle.setRotation(angle, true);
            }
            if (move.x !== 0 || move.y !== 0) {
                const thrust = config.speed * 6 * dt; 
                rb.handle.applyImpulse({ x: move.x * thrust, y: move.y * thrust }, true);
            }
        }
    });
  }

  private updateInputVectors() {
    if (!this.input.isUsingJoypad()) {
        const keys = this.input.keys();
        let mx = 0; let my = 0;
        if (keys.has('w') || keys.has('arrowup')) my += 1;
        if (keys.has('s') || keys.has('arrowdown')) my -= 1;
        if (keys.has('a') || keys.has('arrowleft')) mx -= 1;
        if (keys.has('d') || keys.has('arrowright')) mx += 1;
        if (mx !== 0 || my !== 0) {
            const mag = Math.sqrt(mx*mx + my*my);
            this.input.moveVector.set({ x: mx / mag, y: my / mag });
        } else {
            this.input.moveVector.set({ x: 0, y: 0 });
        }
    }
  }

  applyTopologyRules(dt: number) {
    if (!this.physics.world) return;
    const topo = this.state.topology();
    if (topo === 'platformer') {
      this.physics.world.gravity = { x: 0, y: this.state.gravityY() };
      this.applyGlobalDamping(dt, 0.95); 
    } else if (topo === 'top-down-rpg') {
      this.physics.world.gravity = { x: 0, y: 0 };
      this.applyGlobalDamping(dt, 0.0); 
    } else if (topo === 'top-down-action') {
      this.physics.world.gravity = { x: 0, y: 0 };
      this.applyGlobalDamping(dt, 0.92); 
    }
  }

  private applyGlobalDamping(dt: number, factor: number) {
    if (factor === 0) return;
    this.ecs.rigidBodies.forEach((rb) => {
      if (rb.bodyType === 'dynamic') {
        const vel = rb.handle.linvel();
        const angVel = rb.handle.angvel();
        const damp = Math.pow(factor, dt * 60); 
        rb.handle.setLinvel({ x: vel.x * damp, y: vel.y * damp }, true);
        rb.handle.setAngvel(angVel * damp, true);
      }
    });
  }
}