import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export const NEON_HOTLINE: ScenePreset2D = {
  id: 'arena',
  name: 'Neon Hotline',
  description: 'Direct player control with twin-stick shooter mechanics.',
  tags: ['Action', 'Top-Down', 'Industry-Standard'],
  complexity: 'medium',
  preferredTopology: 'top-down-action',
  
  config: {
    env: {
      type: 'atmosphere',
      background: '#0f172a', // Slate 900
      horizon: '#312e81',    // Indigo 900
      gridOpacity: 0.08
    },
    physics: {
      gravity: { x: 0, y: 0 }
    }
  },

  load: (engine: Engine2DService) => {
    // Topology now handled by config injection, but explict set remains for safety
    engine.state.setTopology('top-down-action');
    const boundSize = 20;
    const thickness = 1;
    
    // Arena Boundaries
    const walls = [
      { x: 0, y: boundSize, w: boundSize * 2, h: thickness },
      { x: 0, y: -boundSize, w: boundSize * 2, h: thickness },
      { x: boundSize, y: 0, w: thickness, h: boundSize * 2 },
      { x: -boundSize, y: 0, w: thickness, h: boundSize * 2 }
    ];

    walls.forEach((w, i) => {
      const id = EntityGenerator.generate();
      engine.ecs.addEntity(id);
      engine.ecs.transforms.set(id, { x: w.x, y: w.y, rotation: 0, scaleX: 1, scaleY: 1 });
      engine.ecs.sprites.set(id, { color: '#0f172a', width: w.w, height: w.h, layer: 0, opacity: 1 });
      engine.ecs.tags.set(id, { name: `Wall_${i}`, tags: new Set(['static']) });
      const rb = engine.physics.createBody(id, 'fixed', w.x, w.y);
      if (rb) engine.physics.createCollider(id, rb, w.w, w.h);
    });

    // SPAWN PLAYER
    engine.factory.spawnPlayer(0, 0);

    // Environment Details
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 12;
      const color = Math.random() > 0.5 ? '#ec4899' : '#8b5cf6';
      engine.spawnBox(Math.cos(angle) * dist, Math.sin(angle) * dist, color, 0.8, 0.8, 'dynamic');
    }

    // Static Cover
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      engine.spawnBox(x, y, '#1e293b', 3, 3, 'fixed');
    }
  }
};