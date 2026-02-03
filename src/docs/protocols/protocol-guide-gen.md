# [T0] Guide Genesis Protocol: Human Translation
ID: PROTOCOL_GUIDE_GEN_V1.0 | Role: Experience Synthesis.

## 1. INTENT
To transform high-density technical engine documentation into immersive, low-friction "Human Translations" (Guides). This protocol decouples pedagogical content from the `RUN_KNOWLEDGE` semantic sync to prioritize aesthetic and interactive learning.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 CONTENT STANDARDS
- **Simplicity**: No complex formulas or Big O notation in guide text.
- **Visual Inference**: Use icon-driven steps (3-4 max) to explain a concept.
- **Immersive Tie-In**: Every guide MUST link to a specific `simulationSceneId` defined in the scene registry.

### 2.2 DATA SCHEMA
Guides must implement the `VisualArticle` interface and reside in `src/data/guides/[slug].ts`.

## 3. LOGIC MATRIX: RUN_GUIDE_GEN [DOMAIN]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **DECODE** | Scan `src/docs/engine/[DOMAIN].md` for core technical principles. |
| 02 | **TRANSLATE** | Re-write principles into layperson "Guide Steps". |
| 03 | **MAP** | Identify the corresponding `ScenePreset2D` that best demonstrates the domain. |
| 04 | **EMIT** | Generate/Update the `.ts` file in `src/data/guides/`. |
| 05 | **REGISTER** | Update `src/data/guides/index.ts` to include the new fragment. |

## 4. SKELETAL GUIDELINE (SG)
```typescript
export const GUIDE_SLUG: VisualArticle = {
  id: 'unique_id',
  title: 'Human Title',
  category: 'core|dynamics|input',
  description: 'Short narrative description.',
  schemaId: 'movement|physics|input',
  steps: [
    { label: 'Name', detail: 'Simplified detail', icon: 'SVG_PATH' }
  ],
  simulationSceneId: 'scene_id'
};
```

## 5. SAFEGUARDS
- **No Text Blocks**: If a step detail exceeds 100 characters, it must be further abstracted.
- **Zoneless Integrity**: Guide rendering must use pure Signal-based templates.
