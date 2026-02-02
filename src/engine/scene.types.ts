import type { Engine2DService } from '../services/engine-2d.service';

export interface ScenePreset2D {
  id: string;
  name: string;
  description: string;
  load: (engine: Engine2DService) => void;
}
