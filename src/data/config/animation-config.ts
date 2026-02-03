
/**
 * Qualia2D Animation Configuration Registry.
 * ID: ANIM_CONFIG_V1.0
 */

export interface AnimationFrameConfig {
  row: number;
  count: number;
  speed: number;
}

export type AnimationState = 'idle' | 'walk' | 'run' | 'interact';

export const PLAYER_ANIMATIONS: Map<AnimationState, AnimationFrameConfig> = new Map([
  ['idle', { row: 0, count: 1, speed: 0 }],
  ['walk', { row: 0, count: 4, speed: 8 }],
  ['run', { row: 0, count: 4, speed: 12 }],
  ['interact', { row: 0, count: 2, speed: 6 }]
]);

export const SPRITE_SHEET_LAYOUT = {
  FRAME_SIZE: 32,
  DIRECTIONS: {
    down: 0,
    up: 1,
    left: 2,
    right: 3
  }
};
