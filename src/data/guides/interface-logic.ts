import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Logic: Tactile Link
 * Source: input-pipeline.md, hud-architecture.md
 */
export const INTERFACE_LOGIC: VisualArticle = {
  id: 'tactile_link',
  title: 'Tactile Link',
  humanLabel: 'Interface Logic',
  category: 'input',
  description: 'The invisible bond between your fingers and the engine\'s state. Optimized for high-density creativity on any device.',
  schemaId: 'input',
  steps: [
    { 
      label: 'Twin-Stick', 
      detail: 'Decoupled movement and aiming for total combat control.', 
      icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' 
    },
    { 
      label: 'Point & Drag', 
      detail: 'Directly reach into the simulation to manipulate physical nodes.', 
      icon: 'M7 7l10 10M17 7L7 17' 
    },
    { 
      label: 'Elastic HUD', 
      detail: 'Interfaces that flex and pulse based on engine telemetry.', 
      icon: 'M3 3h18v18H3z' 
    }
  ],
  simulationSceneId: 'arena'
};