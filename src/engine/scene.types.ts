import type { Engine2DService } from '../services/engine-2d.service';
import type { ControllerTopology } from '../services/engine-state-2d.service';

export type SceneComplexity = 'low' | 'medium' | 'high' | 'stress-test';

export interface SceneEnvironment {
  type: 'solid' | 'atmosphere';
  background: string; // Hex
  horizon?: string;   // Hex (Bottom color for atmosphere)
  gridOpacity?: number;
}

export interface ScenePhysicsConfig {
  gravity: { x: number, y: number };
}

export interface SceneConfig {
  env: SceneEnvironment;
  physics?: ScenePhysicsConfig;
}

export interface ScenePreset2D {
  id: string;
  name: string;
  description: string;
  tags: string[];
  complexity: SceneComplexity;
  preferredTopology?: ControllerTopology;
  
  // [PROTOCOL_PROJECT] Data-Driven Configuration
  config?: SceneConfig;

  // Lifecycle Hooks
  load: (engine: Engine2DService) => void | Promise<void>;
  onEnter?: (engine: Engine2DService) => void;
  onExit?: (engine: Engine2DService) => void;
}