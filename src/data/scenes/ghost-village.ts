import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export const GHOST_VILLAGE: ScenePreset2D = {
  id: 'rpg_demo',
  name: 'Ghost Village',
  description: '8-way grid movement and high damping exploration.',
  tags: ['RPG', 'Top-Down'],
  complexity: 'medium',
  preferredTopology: 'top-down-rpg',
  load: (engine: Engine2DService) => {
    engine.state.setTopology('top-down-rpg');
    engine.factory.spawnPlayer(0, 0);
    
    // Spawn some "villagers" (static boxes)
    for(let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      engine.spawnBox(x, y, '#10b981', 1, 1, 'fixed');
    }
  }
};