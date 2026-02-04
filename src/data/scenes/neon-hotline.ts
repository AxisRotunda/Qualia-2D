import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

// Scene Configuration Constants
const ARENA_CONFIG = {
  BOUND_SIZE: 20,
  WALL_THICKNESS: 1,
  SCATTER_COUNT: 20,
  SCATTER_MIN_DISTANCE: 5,
  SCATTER_MAX_DISTANCE: 17,
  COVER_COUNT: 5,
  COVER_SIZE: 3,
} as const;

const COLORS = {
  BACKGROUND: '#0f172a',  // Slate 900
  HORIZON: '#312e81',      // Indigo 900
  WALL: '#0f172a',
  COVER: '#1e293b',
  SCATTER_PRIMARY: '#ec4899',
  SCATTER_SECONDARY: '#8b5cf6',
} as const;

/**
 * NEON_HOTLINE Scene Preset
 * Direct player control with twin-stick shooter mechanics in a bounded arena.
 * Features procedurally scattered dynamic objects and static cover elements.
 */
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
      background: COLORS.BACKGROUND,
      horizon: COLORS.HORIZON,
      gridOpacity: 0.08
    },
    physics: {
      gravity: { x: 0, y: 0 }
    }
  },

  load: (engine: Engine2DService) => {
    engine.state.setTopology('top-down-action');
    
    // === Arena Boundaries ===
    createArenaBoundaries(engine);
    
    // === Player Spawn ===
    engine.factory.spawnPlayer(0, 0);

    // === Environment: Scattered Dynamic Objects ===
    for (let i = 0; i < ARENA_CONFIG.SCATTER_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = ARENA_CONFIG.SCATTER_MIN_DISTANCE + 
                   Math.random() * (ARENA_CONFIG.SCATTER_MAX_DISTANCE - ARENA_CONFIG.SCATTER_MIN_DISTANCE);
      const color = Math.random() > 0.5 ? COLORS.SCATTER_PRIMARY : COLORS.SCATTER_SECONDARY;
      engine.spawnBox(
        Math.cos(angle) * dist, 
        Math.sin(angle) * dist, 
        color, 
        0.8, 
        0.8, 
        'dynamic'
      );
    }

    // === Static Cover Elements ===
    for (let i = 0; i < ARENA_CONFIG.COVER_COUNT; i++) {
      const x = (Math.random() - 0.5) * ARENA_CONFIG.BOUND_SIZE;
      const y = (Math.random() - 0.5) * ARENA_CONFIG.BOUND_SIZE;
      engine.spawnBox(x, y, COLORS.COVER, ARENA_CONFIG.COVER_SIZE, ARENA_CONFIG.COVER_SIZE, 'fixed');
    }
  }
};

/**
 * Creates the four boundary walls for the arena
 */
function createArenaBoundaries(engine: Engine2DService): void {
  const { BOUND_SIZE, WALL_THICKNESS } = ARENA_CONFIG;
  
  const walls = [
    { x: 0, y: BOUND_SIZE, w: BOUND_SIZE * 2, h: WALL_THICKNESS },   // Top
    { x: 0, y: -BOUND_SIZE, w: BOUND_SIZE * 2, h: WALL_THICKNESS },  // Bottom
    { x: BOUND_SIZE, y: 0, w: WALL_THICKNESS, h: BOUND_SIZE * 2 },   // Right
    { x: -BOUND_SIZE, y: 0, w: WALL_THICKNESS, h: BOUND_SIZE * 2 }   // Left
  ];

  walls.forEach((wall, index) => {
    const id = EntityGenerator.generate();
    engine.ecs.addEntity(id);
    
    engine.ecs.transforms.set(id, { 
      x: wall.x, 
      y: wall.y, 
      rotation: 0, 
      scaleX: 1, 
      scaleY: 1, 
      prevX: wall.x, 
      prevY: wall.y, 
      prevRotation: 0 
    });
    
    engine.ecs.sprites.set(id, { 
      color: COLORS.WALL, 
      width: wall.w, 
      height: wall.h, 
      layer: 0, 
      opacity: 1 
    });
    
    engine.ecs.tags.set(id, { 
      name: `Wall_${index}`, 
      tags: new Set(['static', 'boundary']) 
    });
    
    const rb = engine.physics.createBody(id, 'fixed', wall.x, wall.y);
    if (rb) engine.physics.createCollider(id, rb, wall.w, wall.h);
  });
}
