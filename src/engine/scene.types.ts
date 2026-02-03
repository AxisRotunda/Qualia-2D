import type { Engine2DService } from '../services/engine-2d.service';
import type { ControllerTopology } from '../services/engine-state-2d.service';

export type SceneComplexity = 'low' | 'medium' | 'high' | 'stress-test';

export interface ScenePreset2D {
  id: string;
  name: string;
  description: string;
  tags: string[];
  complexity: SceneComplexity;
  preferredTopology?: ControllerTopology;
  // Lifecycle Hooks
  load: (engine: Engine2DService) => void;
  onEnter?: (engine: Engine2DService) => void;
  onExit?: (engine: Engine2DService) => void;
}