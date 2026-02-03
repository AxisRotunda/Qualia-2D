# [T0] Project Protocol
ID: PROTOCOL_PROJECT_V1.0 | Role: Hierarchy Governance.

## 1. INTENT
Establish a robust Project/Scene hierarchy where a "Project" acts as the persistent container for multiple "Scene Fragments". This protocol governs the serialization, configuration, and transition logic between these states.

## 2. HARD STRUCTURAL DEFINITIONS

### 2.1 THE HIERARCHY
1. **Project**: The root container. Contains global settings, asset manifests, and the scene list.
2. **Scene**: A discrete gameplay fragment. Contains `SceneConfig` (Environment) and `Entities`.
3. **Session**: The runtime state overlay (inventory, flags) that persists *between* scenes.

### 2.2 SCENE CONFIGURATION (Data-Driven)
Scenes must now export a `config` object, removing hardcoded environment logic from the `load()` function.
- **Environment**: Background type (Solid/Gradient), Colors, Grid opacity.
- **Physics**: Default Gravity, Time Scale.

## 3. LOGIC MATRIX: RUN_PROJECT [ACTION]

| Action | Logic |
| :--- | :--- |
| **INIT** | Bootstrap the `ProjectService`. Load default project structure. |
| **SAVE** | Serialize current project state to `StorageService` (Local). |
| **LOAD_SCENE** | Trigger `SceneManager` with the target `ScenePreset2D`, applying its `SceneConfig`. |

## 4. SKELETAL GUIDELINES (SG)

### Scene Config Schema
```typescript
config: {
  env: {
    type: 'atmosphere',
    background: '#020617',
    horizon: '#1e1b4b',
    gridOpacity: 0.1
  },
  physics: {
    gravity: { x: 0, y: -9.81 }
  }
}
```

## 5. SAFEGUARDS
- **Interplay Guard**: Changing projects must trigger a full Engine Reset.
- **Persistence**: Project data changes (adding scenes) are saved to T2 (Persistent Memory).
- **Zoneless**: All project signals must be reactive.