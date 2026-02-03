# [T0] Guide Constructor Protocol
ID: PROTOCOL_GUIDE_CONST_V1.0 | Role: Meta-Genesis for Human Translations.

## 1. INTENT
To standardize the creation of "Human Translations" (Guides) within Qualia2D. This protocol ensures that documentation is not just text, but a high-fidelity, interactive extension of the engine's aesthetic and technical capabilities.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 TITLING PATTERN
Every guide must follow the **[ACTION]_[OBJECT]** or **[OBJECT]_[SYSTEM]** naming convention for its `title` to maintain aerospace density.
- Correct: `KINETIC_TRANSLATION`, `PHYSICS_SOLVER`.
- Incorrect: `How to Move`, `The Physics Guide`.

### 2.2 THE 3-ACT STEP STRUCTURE
Guides must provide exactly 3 `steps` to prevent cognitive overload:
1. **The Principle**: The irreducible law (e.g., "Friction").
2. **The Variable**: What is being manipulated (e.g., "Damping").
3. **The Outcome**: The physical result (e.g., "Snappy Rest").

### 2.3 ICONOGRAPHY STANDARDS
Use high-density SVG paths. Category-specific mapping:
- `movement`: Directional/Vector paths.
- `physics`: Atomic/Geometric/Constraint paths.
- `input`: Tactile/Controller/Connection paths.

## 3. INTERACTIVITY MANDATE
Every `VisualArticle` MUST link to a `simulationSceneId` that allows the user to immediately experience the theory. If a scene doesn't exist for the topic, the guide should link to `playground`.

## 4. SKELETAL GUIDELINE (SG)
```typescript
export const NEW_GUIDE: VisualArticle = {
  id: 'slug_id',
  title: 'ACTION_OBJECT',
  humanLabel: 'Human Friendly Name',
  category: 'core|dynamics|input',
  description: 'A punchy, 20-word max narrative description.',
  schemaId: 'movement|physics|input',
  steps: [
    { label: 'Step 1', detail: 'Short detail.', icon: 'SVG_PATH' },
    { label: 'Step 2', detail: 'Short detail.', icon: 'SVG_PATH' },
    { label: 'Step 3', detail: 'Short detail.', icon: 'SVG_PATH' }
  ],
  simulationSceneId: 'scene_id'
};
```

## 5. SAFEGUARDS
- **No Orphan Guides**: Every guide must be exported in `guides/index.ts`.
- **Contrast Guard**: Descriptions must be legible against Obsidian Glass backgrounds.
- **Zoneless**: Guide data must remain pure POJOs for signal-based rendering.