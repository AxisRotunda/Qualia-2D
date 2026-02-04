import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export const PHYSICS_LAB: ScenePreset2D = {
  id: 'playground',
  name: 'Physics Lab',
  description: 'Standard gravity & jump mechanics playground.',
  tags: ['Platformer', 'Physics', 'Testing'],
  complexity: 'low',
  preferredTopology: 'platformer',
  
  config: {
    env: {
      type: 'solid',
      background: '#334155', // Slate 700
      gridOpacity: 0.15
    },
    physics: {
      gravity: { x: 0, y: -9.81 }
    }
  },

  load: (engine: Engine2DService) => {
    engine.state.setTopology('platformer');
    const floorId = EntityGenerator.generate();
    engine.ecs.addEntity(floorId);
    // FIX: Initialize prevX, prevY, and prevRotation for interpolation
    engine.ecs.transforms.set(floorId, { x: 0, y: -6, rotation: 0, scaleX: 1, scaleY: 1, prevX: 0, prevY: -6, prevRotation: 0 });
    engine.ecs.sprites.set(floorId, { color: '#0f172a', width: 24, height: 2, layer: 0, opacity: 1 });
    const floorRb = engine.physics.createBody(floorId, 'fixed', 0, -6);
    if(floorRb) engine.physics.createCollider(floorId, floorRb, 24, 2);
    
    engine.factory.spawnPlayer(0, 0);
    engine.spawnBox(-4, 2, '#fbbf24', 1, 1, 'dynamic');
    engine.spawnBox(4, 4, '#ef4444', 1, 1, 'dynamic');
  }
};
