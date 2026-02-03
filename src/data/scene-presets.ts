import { EntityGenerator } from '../engine/ecs/entity';
import type { Engine2DService } from '../services/engine-2d.service';
import type { ScenePreset2D } from '../engine/scene.types';

export const SCENES: ScenePreset2D[] = [
  {
    id: 'arena',
    name: 'Neon Hotline',
    description: 'Direct player control with twin-stick shooter mechanics.',
    tags: ['Action', 'Top-Down', 'Industry-Standard'],
    complexity: 'medium',
    preferredTopology: 'top-down-action',
    load: (engine: Engine2DService) => {
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
  },
  {
    id: 'playground',
    name: 'Physics Lab',
    description: 'Standard gravity & jump mechanics playground.',
    tags: ['Platformer', 'Physics', 'Testing'],
    complexity: 'low',
    preferredTopology: 'platformer',
    load: (engine: Engine2DService) => {
        engine.state.setTopology('platformer');
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -6, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#475569', width: 24, height: 2, layer: 0, opacity: 1 });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -6);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 24, 2);
        
        engine.factory.spawnPlayer(0, 0);
        engine.spawnBox(-4, 2, '#fbbf24', 1, 1, 'dynamic');
        engine.spawnBox(4, 4, '#ef4444', 1, 1, 'dynamic');
    }
  },
  {
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
  },
  {
    id: 'stress_test',
    name: 'Kinetic Chaos',
    description: 'High-density physics node stress test.',
    tags: ['Benchmark', 'Stress-Test'],
    complexity: 'stress-test',
    preferredTopology: 'platformer',
    load: (engine: Engine2DService) => {
      engine.state.setTopology('platformer');
      engine.spawnBox(0, -10, '#1e293b', 100, 2, 'fixed');
      
      for(let i = 0; i < 60; i++) {
        const x = (i % 10) * 2 - 10;
        const y = Math.floor(i / 10) * 2;
        engine.spawnBox(x, y, '#8b5cf6', 0.8, 0.8, 'dynamic');
      }
    }
  }
];