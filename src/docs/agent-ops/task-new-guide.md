# [OP_03] Task: Add New Guide
Context: Qualia2D Engine | Architecture: Signal-Driven UI

## 1. TARGET FILES
You need access to ONLY these files to complete this task:
1. `src/data/guides/[your-guide-name].ts` (Create New)
2. `src/data/guides/index.ts` (Register)

## 2. CONSTRAINT CHECKLIST
- [ ] **Schema**: Must match `VisualArticle` interface.
- [ ] **Iconography**: Use simple SVG path data (d attribute only).
- [ ] **Simulation**: Link to an existing scene ID if applicable.

## 3. CODE SKELETON (The Article)
File: `src/data/guides/[your-guide-name].ts`

```typescript
import { VisualArticle } from '../../services/documentation.service';

export const MY_GUIDE: VisualArticle = {
  id: 'unique_guide_id',
  title: 'Human Title',
  humanLabel: 'Subtitle',
  category: 'core', // 'core' | 'dynamics' | 'input'
  description: 'A 1-2 sentence description of the concept.',
  schemaId: 'physics', // 'movement' | 'physics' | 'input'
  steps: [
    { 
      label: 'Step 1', 
      detail: 'Explanation of step 1.', 
      icon: 'M12 2v20' // SVG Path
    },
    { 
      label: 'Step 2', 
      detail: 'Explanation of step 2.', 
      icon: 'M2 12h20' 
    }
  ],
  simulationSceneId: 'playground' // Optional: Links to a playable scene
};
```

## 4. REGISTRATION STEP
File: `src/data/guides/index.ts`

```typescript
import { MY_GUIDE } from './[your-guide-name]';

export const GUIDE_REGISTRY = [
  // ... existing
  MY_GUIDE
];
```