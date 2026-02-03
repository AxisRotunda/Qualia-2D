import { NEON_HOTLINE } from './scenes/neon-hotline';
import { PHYSICS_LAB } from './scenes/physics-lab';
import { GHOST_VILLAGE } from './scenes/ghost-village';
import { KINETIC_CHAOS } from './scenes/kinetic-chaos';
import type { ScenePreset2D } from '../engine/scene.types';

/**
 * Fragment Registry for the Qualia2D Engine.
 * [RUN_REF Optimization]: Scenes decomposed into individual domain files.
 */
export const SCENES: ScenePreset2D[] = [
  NEON_HOTLINE,
  PHYSICS_LAB,
  GHOST_VILLAGE,
  KINETIC_CHAOS
];