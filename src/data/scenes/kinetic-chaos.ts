import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

// Stress Test Configuration
const STRESS_CONFIG = {
  GRID: {
    COLS: 20,
    ROWS: 15,
    SPACING: 1.0,
  },
  GRAVITY_WELLS: {
    CENTRAL: { x: 0, y: 5, strength: 45, radius: 12 },
    LEFT_REPULSOR: { x: -15, y: 0, strength: -30, radius: 6 },
    RIGHT_REPULSOR: { x: 15, y: 0, strength: -30, radius: 6 },
  },
  SPAWN: {
    BATCH_SIZE: 16,
    PLAYER_Y: 15,
  },
  FLOOR: {
    Y: -10,
    WIDTH: 100,
    HEIGHT: 2,
  },
} as const;

const COLORS = {
  FLOOR: '#1e293b',
  ENTITY_PRIMARY: '#8b5cf6',
  ENTITY_SECONDARY: '#6366f1',
} as const;

/**
 * KINETIC_CHAOS Scene Preset
 * High-density physics benchmark demonstrating force field interactions.
 * Uses time-sliced streaming for instant time-to-first-frame (TTFF).
 * [RUN_SCENE_GEN]: Force-Enhanced Stress Test
 * [RUN_ARCHETYPE]: Refactored streaming architecture
 */
export const KINETIC_CHAOS: ScenePreset2D = {
  id: 'stress_test',
  name: 'Kinetic Chaos',
  description: 'High-density physics node stress test with dynamic gravity wells.',
  tags: ['Benchmark', 'Stress-Test', 'Forces'],
  complexity: 'stress-test',
  preferredTopology: 'platformer',
  
  load: async (engine: Engine2DService) => {
    // === Phase 1: Physics Context ===
    engine.state.setTopology('platformer');
    
    // === Phase 2: Structural Foundation ===
    const { FLOOR } = STRESS_CONFIG;
    engine.spawnBox(0, FLOOR.Y, COLORS.FLOOR, FLOOR.WIDTH, FLOOR.HEIGHT, 'fixed');
    
    // === Phase 3: Force Field Network ===
    const { CENTRAL, LEFT_REPULSOR, RIGHT_REPULSOR } = STRESS_CONFIG.GRAVITY_WELLS;
    
    // Central gravity attractor
    engine.factory.spawnGravityWell(CENTRAL.x, CENTRAL.y, CENTRAL.strength, CENTRAL.radius);
    
    // Peripheral repulsors (creates dynamic flow patterns)
    engine.factory.spawnGravityWell(LEFT_REPULSOR.x, LEFT_REPULSOR.y, LEFT_REPULSOR.strength, LEFT_REPULSOR.radius);
    engine.factory.spawnGravityWell(RIGHT_REPULSOR.x, RIGHT_REPULSOR.y, RIGHT_REPULSOR.strength, RIGHT_REPULSOR.radius);

    // === Phase 4: High-Density Entity Grid (Streamed) ===
    const { COLS, ROWS, SPACING } = STRESS_CONFIG.GRID;
    const totalEntities = COLS * ROWS;
    
    await engine.spawner.spawnStream({
      count: totalEntities,
      batchSize: STRESS_CONFIG.SPAWN.BATCH_SIZE,
      factory: (index) => {
        const col = index % COLS;
        const row = Math.floor(index / COLS);
        const x = col * SPACING - (COLS * SPACING / 2);
        const y = row * SPACING + 2;
        const color = Math.random() > 0.5 ? COLORS.ENTITY_PRIMARY : COLORS.ENTITY_SECONDARY;
        
        engine.spawnBox(x, y, color, 0.8, 0.8, 'dynamic');
      }
    });

    // === Phase 5: Player Injection ===
    engine.factory.spawnPlayer(0, STRESS_CONFIG.SPAWN.PLAYER_Y);
  }
};
