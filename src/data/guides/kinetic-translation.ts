import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Translation: KINETIC_TRANSLATION
 * Authority: protocol-guide-constructor.md
 */
export const KINETIC_TRANSLATION: VisualArticle = {
  id: 'movement_dna',
  title: 'KINETIC_TRANSLATION',
  humanLabel: 'Movement DNA',
  category: 'core',
  description: 'The mathematical bridge between intent and motion. Master the physics of slide, drag, and momentum on the XY plane.',
  schemaId: 'movement',
  steps: [
    { 
      label: 'Zero Drift', 
      detail: 'Predictive Kalman filtering ensures your cursor and camera snap to focus without perceived lag.', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
    { 
      label: 'Momentum Curve', 
      detail: 'Physical weight is simulated through topology-specific acceleration and deceleration matrices.', 
      icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' 
    },
    { 
      label: 'Surface Friction', 
      detail: 'Tactile rest is achieved through frame-rate independent linear damping applied directly to the body.', 
      icon: 'M12 2v20M2 12h20' 
    }
  ],
  simulationSceneId: 'arena'
};