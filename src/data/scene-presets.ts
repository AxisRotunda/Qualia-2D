import { EntityGenerator } from '../engine/ecs/entity';
import type { Engine2DService } from '../services/engine-2d.service';
import type { ScenePreset2D } from '../engine/scene.types';

export const SCENES: ScenePreset2D[] = [
  {
    id: 'arena',
    name: 'Neon Hotline',
    description: 'Top-down action with twin-stick aiming.',
    load: (engine: Engine2DService) => {
        engine.state.setTopology('top-down-action');
        
        // Boundaries
        const boundSize = 15;
        const thickness = 1;
        
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
          engine.ecs.sprites.set(id, { color: '#1e293b', width: w.w, height: w.h, layer: 0, opacity: 1 });
          engine.ecs.tags.set(id, { name: `Wall_${i}`, tags: new Set(['static']) });
          const rb = engine.physics.createBody(id, 'fixed', w.x, w.y);
          if (rb) engine.physics.createCollider(id, rb, w.w, w.h);
        });

        // Player
        engine.spawnBox(0, 0, '#6366f1', 1, 1, 'dynamic');

        // Debris / Targets
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 5 + Math.random() * 5;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist;
          engine.spawnBox(x, y, '#ec4899', 0.8, 0.8, 'dynamic');
        }
    }
  },
  {
    id: 'playground',
    name: 'Physics Platformer',
    description: 'Standard gravity & jump mechanics.',
    load: (engine: Engine2DService) => {
        engine.state.setTopology('platformer');
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -6, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#475569', width: 24, height: 2, layer: 0, opacity: 1 });
        engine.ecs.tags.set(floorId, { name: 'Ground', tags: new Set(['static']) });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -6);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 24, 2);
        
        // Player
        engine.spawnBox(0, 0, '#60a5fa', 1, 1, 'dynamic');

        // Obstacles
        engine.spawnBox(-2, 2, '#fbbf24', 1, 1, 'dynamic');
        engine.spawnBox(2, 4, '#ef4444', 1, 1, 'dynamic');
    }
  },
  {
    id: 'rpg_lab',
    name: 'RPG Grid',
    description: 'Snappy movement with no inertia.',
    load: (engine: Engine2DService) => {
      engine.state.setTopology('top-down-rpg');
      
      // Floor Pattern
      for(let x = -5; x <= 5; x+=5) {
        for(let y = -5; y <= 5; y+=5) {
           // Decor only
        }
      }

      const playerId = engine.spawnBox(0, 0, '#10b981', 1, 1); 
      engine.updateEntityName(playerId, 'Hero');

      engine.spawnBox(3, 2, '#6366f1', 1, 1);
      engine.spawnBox(-3, -2, '#f43f5e', 1, 1);
    }
  },
  {
    id: 'dominoes',
    name: 'Domino Run',
    description: 'Chain reaction demo.',
    load: (engine: Engine2DService) => {
        engine.state.setTopology('platformer');
        // Ground
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -5, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#334155', width: 40, height: 1, layer: 0, opacity: 1 });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -5);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 40, 1);

        // Dominoes
        const count = 15;
        const spacing = 1.2;
        const width = 0.3;
        const height = 2.0;
        
        for(let i = 0; i < count; i++) {
            const x = -10 + i * spacing;
            const color = i === 0 ? '#ef4444' : '#60a5fa';
            const id = engine.spawnBox(x, -3.5, color, width, height);
            
            // Give the first one a slight tilt to start the fall
            if (i === 0) {
              const rb = engine.ecs.rigidBodies.get(id);
              if (rb) {
                 rb.handle.setRotation(0.2, true);
              }
            }
        }
    }
  }
];