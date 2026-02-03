import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Translation: PILOT_MASTERY
 * Authority: protocol-guide-constructor.md
 */
export const PLAYER_MASTERY: VisualArticle = {
  id: 'player_mastery',
  title: 'PILOT_MASTERY',
  humanLabel: 'Pilot Mastery',
  category: 'core',
  description: 'Total agency within the planar landscape. Control your avatar through tactical jumps, orbital strafing, and RPG snappiness.',
  schemaId: 'input',
  steps: [
    { 
      label: 'Kinetic Agency', 
      detail: 'Movement vectors are normalized to ensure consistent speed across diagonal trajectories.', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
    { 
      label: 'Orbital Aim', 
      detail: 'Decoupled look vectors allow for precision aiming while maintaining high-speed maneuvering.', 
      icon: 'M12 2v20M2 12h20' 
    },
    { 
      label: 'Physics Jump', 
      detail: 'Vertical impulses are gated by ground-collision logic to provide satisfying, tactile platforming.', 
      icon: 'M5 10l7-7 7 7M12 3v18' 
    }
  ],
  simulationSceneId: 'arena'
};