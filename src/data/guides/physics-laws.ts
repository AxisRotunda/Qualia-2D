import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Logic: Physical Laws
 * Source: physics-integration.md, ecs-architecture.md
 */
export const PHYSICS_LAWS: VisualArticle = {
  id: 'physical_laws',
  title: 'Physical Laws',
  humanLabel: 'Forces & Matter',
  category: 'dynamics',
  description: 'Reality on a plane. Qualia2D uses deterministic WASM solvers to simulate mass, collision, and gravity with zero room for error.',
  schemaId: 'physics',
  steps: [
    { 
      label: 'Solid Mass', 
      detail: 'Every object occupies real space with a calculable volume.', 
      icon: 'M4 4h16v16H4z' 
    },
    { 
      label: 'Gravity', 
      detail: 'A constant vertical force that grounds all dynamic matter.', 
      icon: 'M12 5v14M5 12l7 7 7-7' 
    },
    { 
      label: 'Intersection', 
      detail: 'Collisions are resolved with pixel-perfect mathematical truth.', 
      icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' 
    }
  ],
  simulationSceneId: 'playground'
};