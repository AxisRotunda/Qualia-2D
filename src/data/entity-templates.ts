import type { Engine2DService } from '../services/engine-2d.service';

export const EntityTemplates = {
  // Can be expanded for Prefabs
  createStandardBox: (engine: Engine2DService, x: number, y: number) => {
    return engine.spawnBox(x, y, '#60a5fa', 1, 1);
  },
  createSmallDebri: (engine: Engine2DService, x: number, y: number) => {
    return engine.spawnBox(x, y, '#94a3b8', 0.3, 0.3);
  }
};
