import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Translation: COGNITIVE_LAYERS
 * Authority: protocol-guide-constructor.md
 */
export const MEMORY_STRATIFICATION: VisualArticle = {
  id: 'cognitive_layers',
  title: 'COGNITIVE_LAYERS',
  humanLabel: 'Memory Layers',
  category: 'core',
  description: 'How the engine persists its history across temporal tiers. From ephemeral recall to persistent narrative audit.',
  schemaId: 'input',
  steps: [
    { 
      label: 'Tier 0: Recall', 
      detail: 'Volatile high-speed cache for immediate command undo and telemetry feedback.', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
    { 
      label: 'Tier 1: Semantic', 
      detail: 'Session-level buffer tracking trends and notable architectural mutations.', 
      icon: 'M12 2v20M2 12h20' 
    },
    { 
      label: 'Tier 2: Chronicle', 
      detail: 'Long-term IndexedDB persistence ensuring your engine state survives browser refresh.', 
      icon: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' 
    }
  ],
  simulationSceneId: 'playground'
};