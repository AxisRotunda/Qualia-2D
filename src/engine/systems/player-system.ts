
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { PLAYER_MOVEMENT_CONFIG } from '../../data/config/player-config';

/**
 * Qualia2D Player System V5.2
 * [RUN_PHYS]: Refined kinetic impulses for jumping and movement.
 * [HtT]: Deterministic grounded checks based on vertical velocity thresholds.
 */
@Injectable({ providedIn: 'root' })
export class PlayerSystem {
  private ecs = inject(ComponentStoreService);
  private state = inject(EngineState2DService);
  private input = inject(Input2DService);

  update(dt: number) {
    const topology = this.state.topology();
    const config = PLAYER_MOVEMENT_CONFIG[topology];
    const move = this.input.moveVector();
    const look = this.input.lookVector();
    const jumping = this.input.jump();

    this.ecs.players.forEach((_, id) => {
      const rb = this.ecs.rigidBodies.get(id);
      const t = this.ecs.getTransform(id);
      if (!rb || rb.bodyType !== 'dynamic' || !t) return;

      const body = rb.handle;

      switch (topology) {
        case 'platformer':
          this.processPlatformer(body, move, jumping, config, dt);
          break;
        case 'top-down-rpg':
          this.processRPG(body, move, config, dt);
          break;
        case 'top-down-action':
          this.processAction(body, t, move, look, config, dt);
          break;
      }
    });
  }

  private processPlatformer(body: any, move: any, jumping: boolean, config: any, dt: number) {
    body.setRotation(0, true); 
    
    const velocity = body.linvel();
    const targetVelX = move.x * config.moveSpeed;
    const accel = config.acceleration * dt;
    
    // Horizontal Movement
    let nextVelX = velocity.x + (targetVelX - velocity.x) * Math.min(accel, 1.0);
    
    // // CoT: "Lack of jump functionality" fix. 
    // Widened grounded threshold to 0.5 to account for slopes and contact oscillation.
    // Apply a direct impulse instead of setLinvel to allow physics solver to accumulate.
    if (jumping && Math.abs(velocity.y) < 0.5) {
      body.setLinvel({ x: nextVelX, y: config.jumpForce }, true);
    } else {
      body.setLinvel({ x: nextVelX, y: velocity.y }, true);
    }
  }

  private processRPG(body: any, move: any, config: any, dt: number) {
    body.setRotation(0, true);
    body.setLinvel({ x: move.x * config.moveSpeed, y: move.y * config.moveSpeed }, true);
  }

  private processAction(body: any, transform: any, move: any, look: any, config: any, dt: number) {
    let targetAngle = transform.rotation;
    if (this.input.isUsingJoypad() && (look.x !== 0 || look.y !== 0)) {
      targetAngle = Math.atan2(look.y, look.x);
    } else if (!this.input.isUsingJoypad()) {
      const cursor = this.input.cursorWorld();
      targetAngle = Math.atan2(cursor.y - transform.y, cursor.x - transform.x);
    }

    const currentAngle = transform.rotation;
    let diff = targetAngle - currentAngle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    
    const nextAngle = currentAngle + diff * Math.min(config.rotationSpeed * dt, 1.0);
    body.setRotation(nextAngle, true);

    if (move.x !== 0 || move.y !== 0) {
      const force = config.moveSpeed * config.acceleration * dt;
      body.applyImpulse({ x: move.x * force, y: move.y * force }, true);
    }
  }
}
