import { EntityGenerator } from '../engine/ecs/entity';
import type { Engine2DService } from '../services/engine-2d.service';
import type { ScenePreset2D } from '../engine/scene.types';

export const SCENES: ScenePreset2D[] = [
  {
    id: 'playground',
    name: 'Physics Playground',
    description: 'Basic floor with dynamic boxes.',
    load: (engine: Engine2DService) => {
        // Ground
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
    id: 'tower',
    name: 'Entropy Tower',
    description: 'A delicate stack of boxes.',
    load: (engine: Engine2DService) => {
        // Ground
        const floorId = EntityGenerator.generate();
        engine.ecs.addEntity(floorId);
        engine.ecs.transforms.set(floorId, { x: 0, y: -8, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(floorId, { color: '#334155', width: 30, height: 2, layer: 0, opacity: 1 });
        engine.ecs.tags.set(floorId, { name: 'Ground', tags: new Set(['static']) });
        const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -8);
        if(floorRb) engine.physics.createCollider(floorId, floorRb, 30, 2);

        // Tower
        const rows = 10;
        const boxSize = 1.0;
        const spacing = 0.05;
        
        for(let r = 0; r < rows; r++) {
            const cols = 8 - r; // Pyramidish
            if (cols <= 0) break;
            
            for(let c = 0; c < cols; c++) {
                const rowWidth = cols * (boxSize + spacing);
                const startX = -rowWidth / 2 + boxSize / 2;
                
                const x = startX + c * (boxSize + spacing);
                const y = -6 + r * (boxSize + spacing);
                const color = r % 2 === 0 ? '#8b5cf6' : '#6366f1';
                
                engine.spawnBox(x, y, color, boxSize, boxSize);
            }
        }
    }
  },
  {
      id: 'rain',
      name: 'Chaos Rain',
      description: 'Thousands of particles (stress test).',
      load: (engine: Engine2DService) => {
           // Ground
           const floorId = EntityGenerator.generate();
           engine.ecs.addEntity(floorId);
           engine.ecs.transforms.set(floorId, { x: 0, y: -10, rotation: 0.1, scaleX: 1, scaleY: 1 });
           engine.ecs.sprites.set(floorId, { color: '#1e293b', width: 30, height: 1, layer: 0, opacity: 1 });
           const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -10);
           if(floorRb) {
               engine.physics.world?.getRigidBody(floorRb.handle)?.setRotation({x: 0, y: 0, z: Math.sin(0.1/2), w: Math.cos(0.1/2)}, true);
               engine.physics.createCollider(floorId, floorRb, 30, 1);
           }
           
           // Spawner logic is usually runtime, but we'll just dump 100 boxes
           for(let i=0; i<50; i++) {
               const x = (Math.random() - 0.5) * 10;
               const y = 10 + Math.random() * 20;
               engine.spawnBox(x, y, '#22d3ee', 0.5, 0.5);
           }
      }
  }
];
