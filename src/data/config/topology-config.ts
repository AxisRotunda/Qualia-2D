
import { ControllerTopology } from '../../services/engine-state-2d.service';

/**
 * Qualia2D Topology Configuration Matrix.
 * ID: TOPOLOGY_CONFIG_V1.0
 */

export interface TopologyBehavior {
  gravity: { x: number, y: number };
  damping: number;
  snappyRotation: boolean;
}

export const TOPOLOGY_BEHAVIORS: Record<ControllerTopology, (gravityY: number) => TopologyBehavior> = {
  'platformer': (gy) => ({
    gravity: { x: 0, y: gy },
    damping: 0.95,
    snappyRotation: true
  }),
  'top-down-rpg': (_) => ({
    gravity: { x: 0, y: 0 },
    damping: 0,
    snappyRotation: true
  }),
  'top-down-action': (_) => ({
    gravity: { x: 0, y: 0 },
    damping: 0.92,
    snappyRotation: false
  })
};
