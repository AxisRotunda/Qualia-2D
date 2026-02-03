# [T0] Guide Genesis Protocol: Human Translation
ID: PROTOCOL_GUIDE_GEN_V1.1 | Role: Experience Synthesis.

## 1. INTENT
To transform high-density technical engine documentation into immersive, low-friction "Human Translations" (Guides). This protocol decouples pedagogical content from the `RUN_KNOWLEDGE` semantic sync.

## 2. CONTEXTUAL ANCHOR
- **Authority**: [protocol-guide-constructor.md](./protocol-guide-constructor.md)

## 3. HARD STRUCTURAL DEFINITIONS (HSD)
- **Compliance**: Every guide generated MUST pass the V1.0 Constructor Audit (3 steps, specific titling, interactive link).
- **Aesthetic**: Titles must be uppercase and use underscores for technical flavor.

## 4. LOGIC MATRIX: RUN_GUIDE_GEN [DOMAIN]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **DECODE** | Scan `src/docs/engine/[DOMAIN].md` for core technical principles. |
| 02 | **CONSTRUCT**| Apply `PROTOCOL_GUIDE_CONST` skeletal rules to generate the `VisualArticle`. |
| 03 | **MAP** | Assign the most relevant `ScenePreset2D` for the simulation link. |
| 04 | **EMIT** | Generate/Update the `.ts` file in `src/data/guides/`. |
| 05 | **REGISTER** | Update `src/data/guides/index.ts`. |

## 5. SAFEGUARDS
- **Density Guard**: If a description is too "fluffy," the agent must re-abstract it into engine-centric prose.
- **Icon Guard**: No duplicate icons within a single guide article.