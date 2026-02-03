
import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { Input2DService } from '../../services/input-2d.service';
import { CommandRegistryService } from '../../services/command-registry.service';

@Injectable({ providedIn: 'root' })
export class InteractionSystem {
  private ecs = inject(ComponentStoreService);
  private input = inject(Input2DService);
  private commands = inject(CommandRegistryService);

  private lastActionState = false;

  update(dt: number) {
    const actionPressed = this.input.action();
    
    // Trigger on KeyDown
    if (actionPressed && !this.lastActionState) {
        this.checkInteractions();
    }
    
    this.lastActionState = actionPressed;
  }

  private checkInteractions() {
    // Find Player
    let playerId = -1;
    for (const [id, _] of this.ecs.players) {
        playerId = id;
        break; 
    }
    if (playerId === -1) return;

    const playerT = this.ecs.getTransform(playerId);
    if (!playerT) return;

    this.ecs.interactions.forEach((interact, id) => {
        const t = this.ecs.getTransform(id);
        if (!t) return;

        const dx = playerT.x - t.x;
        const dy = playerT.y - t.y;
        const distSq = dx*dx + dy*dy;

        if (distSq < interact.radius * interact.radius) {
            console.log(`Qualia2D: Interacted with ${interact.label}`);
            this.commands.execute('RUN_RPG_SYS', `INTERACT: ${interact.label} (ID: ${id})`);
            
            // Visual Feedback (Pulse)
            const sprite = this.ecs.getSprite(id);
            if (sprite) {
                const oldColor = sprite.color;
                sprite.color = '#ffffff';
                setTimeout(() => sprite.color = oldColor, 100);
            }
        }
    });
  }
}