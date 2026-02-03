import { VisualArticle } from '../../services/documentation.service';

export const PHYSICS_LAWS: VisualArticle = {
  id: 'physical_laws',
  title: 'Physical Laws',
  humanLabel: 'Forces & Matter',
  category: 'dynamics',
  description: 'A deterministic projection of mass, gravity, and collision. In Qualia2D, everything is a node in a mathematical constant.',
  schemaId: 'physics',
  steps: [
    { label: 'Gravity', detail: 'Constant vertical pull acting on dynamic nodes.', icon: 'M7 11l5 5 5-5M12 4v12' },
    { label: 'Elasticity', detail: 'Restitution factors during node intersection.', icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
    { label: 'Singularity', detail: 'Localized force wells that warp entity paths.', icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' }
  ],
  simulationSceneId: 'playground'
};