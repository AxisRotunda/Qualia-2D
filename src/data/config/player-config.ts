import { ControllerTopology } from '../../services/engine-state-2d.service';

/**
 * Qualia2D Player Configuration.
 * ID: PLAYER_CONFIG_V1.0
 */

export interface PlayerPhysicsConstants {
  moveSpeed: number;
  acceleration: number;
  deceleration: number;
  jumpForce?: number;
  rotationSpeed?: number;
}

export const PLAYER_MOVEMENT_CONFIG: Record<ControllerTopology, PlayerPhysicsConstants> = {
  'platformer': {
    moveSpeed: 12,
    acceleration: 45,
    deceleration: 0.9,
    jumpForce: 14.5
  },
  'top-down-rpg': {
    moveSpeed: 10,
    acceleration: 100, // Instant
    deceleration: 1.0
  },
  'top-down-action': {
    moveSpeed: 15,
    acceleration: 60,
    deceleration: 0.92,
    rotationSpeed: 12
  }
};