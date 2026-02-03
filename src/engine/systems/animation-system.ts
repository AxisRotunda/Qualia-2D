
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { Input2DService } from '../../services/input-2d.service';

@Injectable({ providedIn: 'root' })
export class AnimationSystem {
  private ecs = inject(ComponentStoreService);
  private input = inject(Input2DService);

  update(dt: number) {
    this.ecs.animations.forEach((anim, id) => {
      if (!anim.active) return;
      
      const sprite = this.ecs.getSprite(id);
      if (!sprite) return;

      // 1. Determine State (Simple Movement Check)
      // In a real system, this would come from a State Machine component
      // For now, we infer from Input if it's the player
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

      // 2. Fetch Config
      const config = anim.config.get(anim.state);
      if (!config) return;

      // 3. Advance Timer
      anim.timer += dt * config.speed;
      if (anim.timer >= 1) {
        anim.timer = 0;
        anim.frameIndex = (anim.frameIndex + 1) % config.count;
      }

      // 4. Calculate UVs (Assuming 4-Direction Sheet)
      // Row 0: Down, Row 1: Up, Row 2: Left, Row 3: Right
      let rowOffset = 0;
      switch(anim.facing) {
        case 'down': rowOffset = 0; break;
        case 'up': rowOffset = 1; break;
        case 'left': rowOffset = 2; break;
        case 'right': rowOffset = 3; break;
      }

      // Assuming standard 128x128 sheet with 32x32 frames (4x4 grid)
      const frameSize = 32; 
      sprite.frameWidth = frameSize;
      sprite.frameHeight = frameSize;
      sprite.frameX = anim.frameIndex * frameSize;
      sprite.frameY = (config.row + rowOffset) * frameSize; // config.row is base offset if needed
    });
  }
}