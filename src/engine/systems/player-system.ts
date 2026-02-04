// /src/engine/systems/player-system.ts

import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { PLAYER_MOVEMENT_CONFIG } from '../../data/config/player-config';

/**
 * Qualia2D Player System V6.0
 * [ENHANCED]: Coyote time, input buffering, improved grounded detection, angle normalization
 */
@Injectable({ providedIn: 'root' })
export class PlayerSystem {
  private readonly ecs = inject(ComponentStoreService);
  private readonly state = inject(EngineState2DService);
  private readonly input = inject(Input2DService);

  // Constants
  private readonly GROUNDED_VELOCITY_THRESHOLD = 0.5;
  private readonly COYOTE_TIME_MS = 100;
  private readonly ANGLE_EPSILON = 0.001;
  private readonly MAX_ROTATION_SPEED = 1.0;

  // Player State Tracking
  private playerGroundedTime = new Map<number, number>();
  private lastUpdateTime = performance.now();

  update(dt: number): void {
    if (dt <= 0 || dt > 1) return;

    const currentTime = performance.now();
    this.input.updateBuffers(currentTime);

    const topology = this.state.topology();
    const config = PLAYER_MOVEMENT_CONFIG[topology];
    const move = this.input.moveVector();
    const look = this.input.lookVector();
    const jumping = this.input.jump();

    this.ecs.players.forEach((_, id) => {
      const rb = this.ecs.rigidBodies.get(id);
      const t = this.ecs.getTransform(id);
      
      if (!rb || rb.bodyType !== 'dynamic' || !t || !rb.handle) return;

      const body = rb.handle;

      switch (topology) {
        case 'platformer':
          this.processPlatformer(body, id, move, jumping, config, dt, currentTime);
          break;
        case 'top-down-rpg':
          this.processRPG(body, move, config, dt);
          break;
        case 'top-down-action':
          this.processAction(body, t, move, look, config, dt);
          break;
      }
    });

    this.lastUpdateTime = currentTime;
  }

  private processPlatformer(
    body: any, 
    playerId: number, 
    move: any, 
    jumping: boolean, 
    config: any, 
    dt: number,
    currentTime: number
  ): void {
    body.setRotation(0, true);
    
    const velocity = body.linvel();
    if (!velocity) return;

    const targetVelX = move.x * config.moveSpeed;
    const accel = config.acceleration * dt;
    
    // Horizontal Movement with Smoothing
    const nextVelX = velocity.x + (targetVelX - velocity.x) * Math.min(accel, 1.0);
    
    // Grounded Detection with Coyote Time
    const isGrounded = Math.abs(velocity.y) < this.GROUNDED_VELOCITY_THRESHOLD;
    
    if (isGrounded) {
      this.playerGroundedTime.set(playerId, currentTime);
    }
    
    const lastGrounded = this.playerGroundedTime.get(playerId) ?? 0;
    const timeSinceGrounded = currentTime - lastGrounded;
    const canJump = timeSinceGrounded < this.COYOTE_TIME_MS;

    // Jump Logic with Input Buffering
    const shouldJump = (jumping || this.input.consumeJumpBuffer()) && canJump;
    
    if (shouldJump) {
      body.setLinvel({ x: nextVelX, y: config.jumpForce }, true);
      this.playerGroundedTime.delete(playerId);
    } else {
      body.setLinvel({ x: nextVelX, y: velocity.y }, true);
    }
  }

  private processRPG(body: any, move: any, config: any, dt: number): void {
    if (!body) return;
    
    body.setRotation(0, true);
    
    const targetVelX = move.x * config.moveSpeed;
    const targetVelY = move.y * config.moveSpeed;
    
    body.setLinvel({ x: targetVelX, y: targetVelY }, true);
  }

  private processAction(
    body: any, 
    transform: any, 
    move: any, 
    look: any, 
    config: any, 
    dt: number
  ): void {
    if (!body || !transform) return;

    // Rotation Handling
    let targetAngle = transform.rotation;
    
    if (this.input.isUsingJoypad() && (Math.abs(look.x) > 0.01 || Math.abs(look.y) > 0.01)) {
      targetAngle = Math.atan2(look.y, look.x);
    } else if (!this.input.isUsingJoypad()) {
      const cursor = this.input.cursorWorld();
      const dx = cursor.x - transform.x;
      const dy = cursor.y - transform.y;
      targetAngle = Math.atan2(dy, dx);
    }

    const currentAngle = transform.rotation;
    const normalizedDiff = this.normalizeAngle(targetAngle - currentAngle);
    
    if (Math.abs(normalizedDiff) > this.ANGLE_EPSILON) {
      const rotationAmount = Math.min(
        Math.abs(normalizedDiff),
        config.rotationSpeed * dt * this.MAX_ROTATION_SPEED
      );
      const nextAngle = currentAngle + Math.sign(normalizedDiff) * rotationAmount;
      body.setRotation(nextAngle, true);
    }

    // Movement with Impulse
    const moveMagnitude = Math.hypot(move.x, move.y);
    
    if (moveMagnitude > 0.01) {
      const force = config.moveSpeed * config.acceleration * dt;
      body.applyImpulse({ 
        x: move.x * force, 
        y: move.y * force 
      }, true);
    }
  }

  private normalizeAngle(angle: number): number {
    while (angle < -Math.PI) angle += Math.PI * 2;
    while (angle > Math.PI) angle -= Math.PI * 2;
    return angle;
  }

  reset(): void {
    this.playerGroundedTime.clear();
    this.lastUpdateTime = performance.now();
  }
}
