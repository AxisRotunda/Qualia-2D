
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { Input2DService } from '../../services/input-2d.service';
import { SPRITE_SHEET_LAYOUT } from '../../data/config/animation-config';

@Injectable({ providedIn: 'root' })
export class AnimationSystem {
  private ecs = inject(ComponentStoreService);
  private input = inject(Input2DService);

  update(dt: number) {
    this.ecs.animations.forEach((anim, id) => {
      if (!anim.active) return;
      
      const sprite = this.ecs.getSprite(id);
      if (!sprite) return;

      // 1. Sync State (For Player specifically)
      if (this.ecs.players.has(id)) {
        const move = this.input.moveVector();
        const isMoving = Math.abs(move.x) > 0.1 || Math.abs(move.y) > 0.1;
        anim.state = isMoving ? 'walk' : 'idle';

        if (Math.abs(move.x) > Math.abs(move.y)) {
           anim.facing = move.x > 0 ? 'right' : 'left';
        } else if (Math.abs(move.y) > 0.1) {
           anim.facing = move.y > 0 ? 'up' : 'down';
        }
      }

      // 2. Advance Frame Timer
      const config = anim.config.get(anim.state);
      if (!config) return;

      anim.timer += dt * config.speed;
      if (anim.timer >= 1) {
        anim.timer = 0;
        anim.frameIndex = (anim.frameIndex + 1) % config.count;
      }

      // 3. Map to Sprite UVs
      const rowOffset = SPRITE_SHEET_LAYOUT.DIRECTIONS[anim.facing] || 0;
      const fSize = SPRITE_SHEET_LAYOUT.FRAME_SIZE;

      sprite.frameWidth = fSize;
      sprite.frameHeight = fSize;
      sprite.frameX = anim.frameIndex * fSize;
      sprite.frameY = (config.row + rowOffset) * fSize;
    });
  }
}
