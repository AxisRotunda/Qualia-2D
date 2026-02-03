# [T1] Scene Lifecycle: Fragment Transitions
ID: ENGINE_SCENE_V1.0 | Role: Reality Management.

## 1. ARCHITECTURE
Qualia2D defines reality through "Fragments" (Scene Presets). The `SceneManagerService` governs the transition between these fragments, ensuring total state cleanup and deterministic initialization.

## 2. THE TRANSITION PROTOCOL
Transitions follow a strict serial sequence to prevent state leakage and "Physics Ghosting" (inter-scene collisions).

| Phase | Action | Responsibility |
| :--- | :--- | :--- |
| **01: INITIATE** | Set `transitioning` signal. Trigger UI Loading Screen. | SceneManager |
| **02: EXIT** | Invoke `onExit()` hook for current scene. | SceneManager |
| **03: PURGE** | `physics.reset()` (WASM free) + `ecs.clear()`. | PhysicsEngine / ECS |
| **04: RE-INDEX** | `EntityGenerator.reset()`. Reset Input buffers. | Entity / Input |
| **05: LOAD** | Invoke `scene.load(engine)`. Inject components. | Scene / Factory |
| **06: ENTER** | Invoke `onEnter()` hook. Set `currentScene` signal. | SceneManager |
| **07: REVEAL** | Clear Loading state. Trigger UI Entrance animations. | EngineState |

## 3. HOOKS & EXTENSIONS
- **`load()`**: Mandatory. Primary entity spawning and topology setting.
- **`onEnter()`**: Optional. Triggers post-load logic (e.g., specific camera framing).
- **`onExit()`**: Optional. Used for persisting global state before destruction.

## 4. DESIGN STANDARDS
1. **Asynchronicity**: Transitions must yield to the browser (using `requestAnimationFrame`) to ensure the UI remains responsive during heavy ECS instantiation.
2. **Topology First**: Scenes MUST define their `preferredTopology` to automatically calibrate the physics and controller systems.
3. **Data Isolation**: Static scene definitions reside in `src/data/scenes/` and export a `ScenePreset2D` object.

## 5. SAFEGUARDS
- **Double Transition Guard**: The manager rejects new transition requests until the current cycle is complete.
- **State Integrity**: `ecs.clear()` is the absolute "Hard Reset" that prevents entity ID leakage across fragments.