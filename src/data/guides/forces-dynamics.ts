import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Translation: FIELD_DYNAMICS
 * Authority: protocol-guide-constructor.md
 */
export const FORCES_DYNAMICS: VisualArticle = {
  id: 'field_dynamics',
  title: 'FIELD_DYNAMICS',
  humanLabel: 'Force Mechanics',
  category: 'dynamics',
  description: 'Invisible influences that shape the planar flow. Control gravity wells, repulsion zones, and non-collision attractors.',
  schemaId: 'physics',
  steps: [
    { 
      label: 'Force Projection', 
      detail: 'Singularities that apply radial impulses based on proximity and field strength.', 
      icon: 'M12 4.5v15m7.5-7.5h-15' 
    },
    { 
      label: 'Repulsion Shield', 
      detail: 'High-pressure kinetic boundaries that protect regions from dynamic entity penetration.', 
      icon: 'M4.5 12h15M12 4.5v15' 
    },
    { 
      label: 'Distance Decay', 
      detail: 'Force magnitude scales inversely with distance to ensure stable, non-explosive dynamics.', 
      icon: 'M3 12h18M3 6h18M3 18h18' 
    }
  ],
  simulationSceneId: 'stress_test'
};