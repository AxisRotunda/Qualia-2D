# [T1] Narrative Engine: Session & Persistence
ID: ENGINE_NARRATIVE_V1.0 | Role: Project-Level Continuity.

## 1. OVERVIEW
The Narrative Engine bridges the gap between individual "Scene Fragments" and a cohesive "Game Project." It manages persistent state (Flags, Stats, Inventory) that survives the total ECS purge during scene transitions.

## 2. THE SESSION LAYER
Governed by `GameSessionService`, this layer serves as the persistent "Black Box" of the pilot's journey.

### [S0] PERSISTENT FLAGS
- **Storage**: `Map<string, boolean>` within the service.
- **Persistence**: Synced to `StorageService` (LocalStorage) for cross-session recovery.
- **Usage**: Gates for portals, dialog branches, and world-state mutations.

### [S1] THE DIALOG STACK
- **Reactivity**: Signal-based (`activeDialog`).
- **Flow**: `InteractionSystem` triggers -> `GameSessionService` stores -> `DialogOverlayComponent` projects.
- **Escapement**: The "Action" input (Space/Touch) advances/closes dialogs, creating a modal interaction loop.

## 3. SPATIAL TRIGGERS (THE BRIDGE)
Interactions are the primary interface between the physical world and the narrative state.

| Component | Target System | Narrative Outcome |
| :--- | :--- | :--- |
| `Interaction` | `InteractionSystem` | Generic Command Execution (Logic). |
| `DialogComponent` | `GameSessionService` | UI Projection of text/speaker (Story). |
| `PortalComponent` | `SceneManagerService` | Reality Fragment Transition (Progression). |

## 4. LOGIC FLOW: PORTAL TRANSITION
1. **Trigger**: Player enters `Interaction` radius + presses `Action`.
2. **Resolve**: `InteractionSystem` reads `PortalComponent`.
3. **Transition**: `SceneManager` executes transition to `targetSceneId`.
4. **Spawn**: Player is re-instantiated at `spawnX/Y` in the new fragment.

## 5. SAFEGUARDS
- **Orphan Guard**: Portals must point to valid scene IDs in the `SCENE_REGISTRY`.
- **State Integrity**: Session state is NOT cleared during `ecs.clear()`.
- **Zoneless**: All narrative emissions must be Signal-driven to ensure UI reactivity during physics-heavy ticks.