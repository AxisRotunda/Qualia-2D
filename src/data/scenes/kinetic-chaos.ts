import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

/**
 * [RUN_SCENE_GEN]: Kinetic Chaos (Force-Enhanced)
 * Demonstrates high-density physics interaction combined with dynamic force fields.
 * [RUN_ARCHETYPE]: Refactored to use time-sliced streaming for instant TTFF.
 */
export const KINETIC_CHAOS: ScenePreset2D = {
  id: 'stress_test',
  name: 'Kinetic Chaos',
  description: 'High-density physics node stress test with dynamic gravity wells.',
  tags: ['Benchmark', 'Stress-Test', 'Forces'],
  complexity: 'stress-test',
  preferredTopology: 'platformer',
  load: async (engine: Engine2DService) => {
    // 1. Physics Context
    engine.state.setTopology('platformer');
    
    // 2. Structural Bounds
    engine.spawnBox(0, -10, '#1e293b', 100, 2, 'fixed');
    
    // 3. The Core: Central Gravity Well
    engine.factory.spawnGravityWell(0, 5, 45, 12);
    
    // 4. Peripheral Repulsors (Rose-themed)
    engine.factory.spawnGravityWell(-15, 0, -30, 6);
    engine.factory.spawnGravityWell(15, 0, -30, 6);

    // 5. Massive Density Spawn (Streamed)
    const cols = 20; // Increased density for benchmark
    const rows = 15;
    const count = cols * rows;
    const spacing = 1.0;
    
    await engine.spawner.spawnStream({
      count: count,
      batchSize: 16,
      factory: (i) => {
        const x = (i % cols) * spacing - (cols * spacing / 2);
        const y = Math.floor(i / cols) * spacing + 2;
        const color = Math.random() > 0.5 ? '#8b5cf6' : '#6366f1';
        engine.spawnBox(x, y, color, 0.8, 0.8, 'dynamic');
      }
    });

    // 6. Player Injection
    engine.factory.spawnPlayer(0, 15);
  }
};