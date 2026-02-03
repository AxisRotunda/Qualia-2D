import { VisualArticle } from '../../services/documentation.service';

/**
 * [RUN_GUIDE_GEN] Logic: Cognitive Layers
 * Source: protocol-memory-arch.md, memory-2d.service.ts
 */
export const MEMORY_STRATIFICATION: VisualArticle = {
  id: 'cognitive_layers',
  title: 'Cognitive Layers',
  humanLabel: 'Memory Stratification',
  category: 'core',
  description: 'How the engine processes and persists its session history across three distinct temporal tiers, ensuring O(1) recall and total persistence.',
  schemaId: 'input', // Mapping to 'Input/Storage' iconography
  steps: [
    { 
      label: 'Tier 0: Ephemeral', 
      detail: 'High-frequency LRU cache for immediate O(1) recall of active session commands.', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
    { 
      label: 'Tier 1: Semantic', 
      detail: 'Short-term buffer maintaining a sliding window of recent cognitive fragments.', 
      icon: 'M12 2v20M2 12h20' 
    },
    { 
      label: 'Tier 2: Persistent', 
      detail: 'Long-term IndexedDB storage acting as the engine\'s irreducible historical audit.', 
      icon: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' 
    }
  ],
  simulationSceneId: 'playground'
};