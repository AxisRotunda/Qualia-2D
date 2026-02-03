import { Injectable, inject, Injector } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { Input2DService } from '../../services/input-2d.service';
import { CommandRegistryService } from '../../services/command-registry.service';
import { GameSessionService } from '../../services/game-session.service';
import { SceneManagerService } from '../../services/scene-manager.service';
import { SCENES } from '../../data/scene-presets';
import { Engine2DService } from '../../services/engine-2d.service';

@Injectable({ providedIn: 'root' })
export class InteractionSystem {
  private ecs = inject(ComponentStoreService);
  private input = inject(Input2DService);
  private commands = inject(CommandRegistryService);
  private session = inject(GameSessionService);
  private sceneManager = inject(SceneManagerService);
  private injector = inject(Injector);

  private lastActionState = false;

  update(dt: number) {
    const actionPressed = this.input.action();
    
    // Trigger on KeyDown
    if (actionPressed && !this.lastActionState) {
        if (this.session.isDialogActive()) {
            this.session.closeDialog();
        } else {
            this.checkInteractions();
        }
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
            this.handleInteraction(id, interact);
        }
    });
  }

  private handleInteraction(id: number, interact: any) {
    // 1. Dialog System
    const dialog = this.ecs.getDialog(id);
    if (dialog) {
        this.session.startDialog(dialog.speaker, dialog.text);
    }

    // 2. Portal System
    const portal = this.ecs.getPortal(id);
    if (portal) {
        const target = SCENES.find(s => s.id === portal.targetSceneId);
        if (target) {
            // REPAIR: Resolve Engine2DService lazily to break circular dependency [NG0200]
            const engine = this.injector.get(Engine2DService);
            engine.loadScene(target);
        }
    }

    // 3. Generic Command
    this.commands.execute('RUN_RPG_SYS', `INTERACT: ${interact.label} (ID: ${id})`);
    
    // Visual Feedback (Pulse)
    const sprite = this.ecs.getSprite(id);
    if (sprite) {
        const oldColor = sprite.color;
        sprite.color = '#ffffff';
        setTimeout(() => sprite.color = oldColor, 100);
    }
  }
}