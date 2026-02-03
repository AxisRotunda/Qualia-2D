import { VisualArticle } from '../../services/documentation.service';

export const KINETIC_TRANSLATION: VisualArticle = {
  id: 'movement_dna',
  title: 'Movement DNA',
  humanLabel: 'Kinetic Translation',
  category: 'core',
  description: 'The fundamental logic governing how intent is translated into planar motion. It defines the bridge between raw input and world velocity.',
  schemaId: 'movement',
  steps: [
    { label: 'Precision', detail: 'Frame-rate independent lerping for smooth tracking.', icon: 'M9 11l3 3L22 4' },
    { label: 'Momentum', detail: 'Simulated inertia and drag for action topology.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Friction', detail: 'Surface-specific damping variables.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' }
  ],
  simulationSceneId: 'rpg_demo'
};