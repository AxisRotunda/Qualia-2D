import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Logic: Movement DNA
 * Source: camera-projection.md, input-pipeline.md
 */
export const KINETIC_TRANSLATION: VisualArticle = {
  id: 'movement_dna',
  title: 'Movement DNA',
  humanLabel: 'Kinetic Translation',
  category: 'core',
  description: 'The mathematical bridge between your intent and the world\'s motion. Qualia2D ensures that every slide and press feels intentional and physically grounded.',
  schemaId: 'movement',
  steps: [
    { 
      label: 'Zero Drift', 
      detail: 'Precision tracking that snaps to your focus without lag.', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
    { 
      label: 'Momentum', 
      detail: 'Simulated weight that gives every turn a natural physical drag.', 
      icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' 
    },
    { 
      label: 'Friction', 
      detail: 'Surface damping that controls how fast you come to a rest.', 
      icon: 'M12 2v20M2 12h20' 
    }
  ],
  simulationSceneId: 'rpg_demo'
};