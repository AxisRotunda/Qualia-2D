import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export const KINETIC_CHAOS: ScenePreset2D = {
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
};