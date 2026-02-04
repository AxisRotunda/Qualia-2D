import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { Input2DService } from '../../services/input-2d.service';
import { SPRITE_SHEET_LAYOUT } from '../../data/config/animation-config';

// Animation System Configuration
const ANIMATION_CONFIG = {
  MOVEMENT_THRESHOLD: 0.1,
  MIN_AXIS_DELTA: 0.1,
  FRAME_TIMER_RESET: 0,
  FRAME_ADVANCE_THRESHOLD: 1.0,
} as const;

/**
 * Animation System V2.0
 * Handles sprite sheet animation with state-based frame progression.
 * Features:
 * - Input-driven state transitions (idle/walk)
 * - Directional facing updates (up/down/left/right)
 * - Frame-rate independent animation timing
 * - UV coordinate mapping for sprite sheets
 */
@Injectable({ providedIn: 'root' })
export class AnimationSystem {
  private readonly ecs = inject(ComponentStoreService);
  private readonly input = inject(Input2DService);

  /**
   * Updates all active animations
   * @param dt - Delta time in seconds (frame-rate independent)
   */
  update(dt: number): void {
    if (dt <= 0 || dt > 1) return; // Guard against invalid delta times

    this.ecs.animations.forEach((anim, id) => {
      if (!anim.active) return;
      
      const sprite = this.ecs.getSprite(id);
      if (!sprite) return;

      // Phase 1: State Synchronization (Player-specific)
      if (this.ecs.players.has(id)) {
        this.updatePlayerAnimationState(anim);
      }

      // Phase 2: Frame Progression
      this.advanceAnimationFrame(anim, dt);

      // Phase 3: Sprite UV Mapping
      this.mapAnimationToSprite(anim, sprite);
    });
  }

  /**
   * Updates animation state based on player input
   */
  private updatePlayerAnimationState(anim: any): void {
    const move = this.input.moveVector();
    const isMoving = Math.abs(move.x) > ANIMATION_CONFIG.MOVEMENT_THRESHOLD || 
                     Math.abs(move.y) > ANIMATION_CONFIG.MOVEMENT_THRESHOLD;
    
    anim.state = isMoving ? 'walk' : 'idle';

    // Update facing direction based on dominant movement axis
    const absX = Math.abs(move.x);
    const absY = Math.abs(move.y);

    if (absX > absY && absX > ANIMATION_CONFIG.MIN_AXIS_DELTA) {
      anim.facing = move.x > 0 ? 'right' : 'left';
    } else if (absY > ANIMATION_CONFIG.MIN_AXIS_DELTA) {
      anim.facing = move.y > 0 ? 'up' : 'down';
    }
    // Retain previous facing direction if no significant movement
  }

  /**
   * Advances animation frame based on timing configuration
   */
  private advanceAnimationFrame(anim: any, dt: number): void {
    const config = anim.config.get(anim.state);
    if (!config) return;

    anim.timer += dt * config.speed;
    
    if (anim.timer >= ANIMATION_CONFIG.FRAME_ADVANCE_THRESHOLD) {
      anim.timer = ANIMATION_CONFIG.FRAME_TIMER_RESET;
      anim.frameIndex = (anim.frameIndex + 1) % config.count;
    }
  }

  /**
   * Maps animation frame to sprite UV coordinates
   */
  private mapAnimationToSprite(anim: any, sprite: any): void {
    const config = anim.config.get(anim.state);
    if (!config) return;

    const rowOffset = SPRITE_SHEET_LAYOUT.DIRECTIONS[anim.facing] ?? 0;
    const frameSize = SPRITE_SHEET_LAYOUT.FRAME_SIZE;

    sprite.frameWidth = frameSize;
    sprite.frameHeight = frameSize;
    sprite.frameX = anim.frameIndex * frameSize;
    sprite.frameY = (config.row + rowOffset) * frameSize;
  }
}
