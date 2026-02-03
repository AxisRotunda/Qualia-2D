import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Logic: Field Dynamics
 * Source: protocol-forces.md, physics-system.service.ts
 */
export const FORCES_DYNAMICS: VisualArticle = {
  id: 'field_dynamics',
  title: 'Field Dynamics',
  humanLabel: 'Invisible Forces',
  category: 'dynamics',
  description: 'Non-collision influences that shape the flow of the simulation. Gravity wells, repulsion zones, and magnetic attractors.',
  schemaId: 'physics',
  steps: [
    { 
      label: 'Attraction', 
      detail: 'Gravitational singularities that pull mass towards a center point.', 
      icon: 'M12 4.5v15m7.5-7.5h-15' 
    },
    { 
      label: 'Repulsion', 
      detail: 'High-pressure zones that actively push dynamic entities away.', 
      icon: 'M4.5 12h15M12 4.5v15' 
    },
    { 
      label: 'Falloff', 
      detail: 'Strength decays over distance to prevent infinite velocity loops.', 
      icon: 'M3 12h18M3 6h18M3 18h18' 
    }
  ],
  simulationSceneId: 'playground'
};
