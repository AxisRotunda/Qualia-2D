# [T0] Demo Projects Protocol
ID: PROTOCOL_DEMO_PROJECTS_V1.0 | Role: Onboarding & Showcase Governance.

## 1. INTENT
To provide fully-featured, playable "Vertical Slices" of the engine's capabilities. Demo Projects serve as templates that users can clone to inspect best practices (ECS layout, Physics tuning, Asset usage).

## 2. HARD STRUCTURAL DEFINITIONS

### 2.1 THE DEMO MANIFEST
A Demo is more than a scene; it is a **Project Template**.
- **Interface**: `DemoManifest`.
- **Components**:
  - `id`: Unique slug (e.g., `demo_slime_soccer`).
  - `name`: Human-readable title.
  - `scenes`: A list of `ScenePreset2D` objects specific to this demo.
  - `assets`: (Implicit) Procedural texture generators required by the demo.

### 2.2 FOLDER HIERARCHY
Demos reside in `src/data/demos/`.
- `src/data/demos/[slug]/index.ts`: The Manifest and Scene definitions.
- `src/data/demos/[slug]/assets.ts`: (Optional) Specialized texture generators.

## 3. LIFECYCLE: HYDRATION
When a user selects "Create from Demo":
1. **INSTANTIATE**: A new `ProjectData` entry is created in `ProjectService`.
2. **LINK**: The project's `sceneOverrides` are pre-populated with the Demo's tuning.
3. **REGISTER**: The Demo's scenes are (conceptually) unlocked in the user's workspace.

## 4. LOGIC MATRIX: RUN_DEMO [ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **RESOLVE** | Locate `DemoManifest` in registry. |
| 02 | **CLONE** | Create new Project ID `proj_[timestamp]`. |
| 03 | **INJECT** | Set `lastSceneId` to the Demo's entry point. |
| 04 | **LOAD** | Transition engine to the new Project context. |

## 5. SAFEGUARDS
- **Asset Independence**: Demos must rely on `AssetRegistry` or `procedural-textures.ts`; no external HTTP dependencies (except placeholder images).
- **Topology Lock**: Demos should enforce their preferred topology via `SceneConfig`.
