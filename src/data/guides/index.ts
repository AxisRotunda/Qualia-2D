import { KINETIC_TRANSLATION } from './kinetic-translation';
import { PHYSICS_LAWS } from './physics-laws';
import { INTERFACE_LOGIC } from './interface-logic';
import { FORCES_DYNAMICS } from './forces-dynamics';
import { MEMORY_STRATIFICATION } from './memory-stratification';
import { PLAYER_MASTERY } from './player-mastery';
import { GUIDE_TO_GUIDES } from './guide-to-guides';

export const GUIDE_REGISTRY = [
  GUIDE_TO_GUIDES, // Meta first
  KINETIC_TRANSLATION,
  PHYSICS_LAWS,
  FORCES_DYNAMICS,
  INTERFACE_LOGIC,
  MEMORY_STRATIFICATION,
  PLAYER_MASTERY
];