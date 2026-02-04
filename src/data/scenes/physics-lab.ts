import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

// Lab Configuration
const LAB_CONFIG = {
  FLOOR: {
    POSITION: { x: 0, y: -6 },
    SIZE: { width: 24, height: 2 },
  },
  PLAYER: {
    SPAWN: { x: 0, y: 0 },
  },
  TEST_OBJECTS: [
    { x: -4, y: 2, color: '#fbbf24', size: 1 },  // Gold box
    { x: 4, y: 4, color: '#ef4444', size: 1 },   // Red box
  ],
} as const;

const COLORS = {
  BACKGROUND: '#334155',  // Slate 700
  FLOOR: '#0f172a',       // Slate 900
} as const;

/**
 * PHYSICS_LAB Scene Preset
 * Standard gravity platformer environment for physics testing.
 * Provides a minimal setup for experimenting with jump mechanics and object interactions.
 */
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
      background: COLORS.BACKGROUND,
      gridOpacity: 0.15
    },
    physics: {
      gravity: { x: 0, y: -9.81 }
    }
  },

  load: (engine: Engine2DService) => {
    engine.state.setTopology('platformer');
    
    // === Foundation: Ground Plane ===
    spawnFloor(engine);
    
    // === Player Spawn ===
    engine.factory.spawnPlayer(LAB_CONFIG.PLAYER.SPAWN.x, LAB_CONFIG.PLAYER.SPAWN.y);
    
    // === Test Objects ===
    LAB_CONFIG.TEST_OBJECTS.forEach(obj => {
      engine.spawnBox(obj.x, obj.y, obj.color, obj.size, obj.size, 'dynamic');
    });
  }
};

/**
 * Creates the main floor platform
 */
function spawnFloor(engine: Engine2DService): void {
  const { POSITION, SIZE } = LAB_CONFIG.FLOOR;
  
  const floorId = EntityGenerator.generate();
  engine.ecs.addEntity(floorId);
  
  engine.ecs.transforms.set(floorId, { 
    x: POSITION.x, 
    y: POSITION.y, 
    rotation: 0, 
    scaleX: 1, 
    scaleY: 1, 
    prevX: POSITION.x, 
    prevY: POSITION.y, 
    prevRotation: 0 
  });
  
  engine.ecs.sprites.set(floorId, { 
    color: COLORS.FLOOR, 
    width: SIZE.width, 
    height: SIZE.height, 
    layer: 0, 
    opacity: 1 
  });
  
  const floorRb = engine.physics.createBody(floorId, 'fixed', POSITION.x, POSITION.y);
  if (floorRb) {
    engine.physics.createCollider(floorId, floorRb, SIZE.width, SIZE.height);
  }
}
