import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Translation: PHYSICAL_SOLVER
 * Authority: protocol-guide-constructor.md
 */
export const PHYSICS_LAWS: VisualArticle = {
  id: 'physical_laws',
  title: 'PHYSICAL_SOLVER',
  humanLabel: 'Simulation Laws',
  category: 'dynamics',
  description: 'The fundamental laws governing planar matter. Deterministic WASM solvers simulate mass, volume, and collision with absolute truth.',
  schemaId: 'physics',
  steps: [
    { 
      label: 'Rigid Integrity', 
      detail: 'Every entity occupies discrete space defined by its physical collider hull and mass properties.', 
      icon: 'M4 4h16v16H4z' 
    },
    { 
      label: 'Gravity Constants', 
      detail: 'Simulation-wide vertical forces provide the grounding necessary for stable kinetic interaction.', 
      icon: 'M12 5v14M5 12l7 7 7-7' 
    },
    { 
      label: 'Solver Accuracy', 
      detail: 'Sub-stepping logic resolves collisions at 60Hz to prevent entity tunneling and kinetic collapse.', 
      icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' 
    }
  ],
  simulationSceneId: 'playground'
};