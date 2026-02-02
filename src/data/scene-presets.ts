
import { EntityGenerator } from '../engine/ecs/entity';
import type { Engine2DService } from '../services/engine-2d.service';
import type { ScenePreset2D } from '../engine/scene.types';

export const SCENES: ScenePreset2D[] = [
  {
    id: 'playground',
    name: 'Physics Playground',
    description: 'Basic floor with dynamic boxes.',
    load: (engine: Engine2DService) => {
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -6, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#475569', width: 24, height: 2, layer: 0, opacity: 1 });
        engine.ecs.tags.set(floorId, { name: 'Ground', tags: new Set(['static']) });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -6);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 24, 2);
        
        engine.spawnBox(-2, 2, '#fbbf24');
        engine.spawnBox(2, 4, '#ef4444');
        engine.spawnBox(0, 8, '#60a5fa');
    }
  },
  {
    id: 'dominoes',
    name: 'Domino Run',
    description: 'A chain reaction of falling rectangles.',
    load: (engine: Engine2DService) => {
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
  },
  {
    id: 'tower',
    name: 'Entropy Tower',
    description: 'A delicate stack of boxes.',
    load: (engine: Engine2DService) => {
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -8, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#334155', width: 30, height: 2, layer: 0, opacity: 1 });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -8);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 30, 2);

        const rows = 8;
        const boxSize = 1.0;
        const spacing = 0.05;
        
        for(let r = 0; r < rows; r++) {
            const cols = 8 - r;
            if (cols <= 0) break;
            
            for(let c = 0; c < cols; c++) {
                const rowWidth = cols * (boxSize + spacing);
                const startX = -rowWidth / 2 + boxSize / 2;
                const x = startX + c * (boxSize + spacing);
                const y = -6 + r * (boxSize + spacing);
                engine.spawnBox(x, y, '#8b5cf6', boxSize, boxSize);
            }
        }
    }
  },
  {
      id: 'rain',
      name: 'Chaos Rain',
      description: 'Particles stress test.',
      load: (engine: Engine2DService) => {
           const floorId = EntityGenerator.generate();
           engine.ecs.addEntity(floorId);
           engine.ecs.transforms.set(floorId, { x: 0, y: -10, rotation: 0, scaleX: 1, scaleY: 1 });
           engine.ecs.sprites.set(floorId, { color: '#1e293b', width: 40, height: 1, layer: 0, opacity: 1 });
           const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -10);
           if(floorRb) engine.physics.createCollider(floorId, floorRb, 40, 1);
           
           for(let i=0; i<60; i++) {
               const x = (Math.random() - 0.5) * 15;
               const y = 5 + Math.random() * 25;
               engine.spawnBox(x, y, '#22d3ee', 0.4, 0.4);
           }
      }
  }
];
