# [T0] Topology Protocol
ID: PROTOCOL_TOPOLOGY_V2.0 | Role: Physics Context Management.

## 1. INTENT
Govern the engine's behavior across different Physics Modes (Platformer, Top-Down, Zero-G). V2.0 enforces **Strict Scene Binding**, treating Topology as a fundamental property of the Scene Fragment rather than a volatile engine setting.

## 2. HARD STRUCTURAL DEFINITIONS
- **Source of Truth**: `SceneConfig.topology` (Persisted in Project Data).
- **Runtime Signal**: `EngineState2DService.topology` (Derived from Scene Load).
- **Restriction**: Runtime switching via global settings is **forbidden** to prevent simulation destabilization.

## 3. TOPOLOGY STANDARDS (INDUSTRY ALIGNMENT)

### 3.1 PLATFORMER (Side-View)
- **Gravity**: -Y (Standard 9.81 or Custom).
- **Damping**: Low (0.0). Air resistance only.
- **Input Mapping**:
  - `Move X`: Lateral impulse.
  - `Move Y`: Ignored (replaced by Jump).
  - `Look`: Ignored (Character faces motion).

### 3.2 TOP-DOWN RPG (Zelda-like)
- **Gravity**: Zero.
- **Damping**: Instant (1.0). Velocity stops immediately on input release.
- **Input Mapping**:
  - `Move X/Y`: Direct velocity mapping.
  - `Look`: Ignored (Character faces motion).

### 3.3 TOP-DOWN ACTION (Twin-Stick)
- **Gravity**: Zero.
- **Damping**: High (0.92). Drifty inertia.
- **Input Mapping**:
  - `Move X/Y`: Thruster impulse (Acceleration).
  - `Look X/Y`: Independent Turret rotation.

## 4. LOGIC MATRIX
1. **Scene Load**: `SceneManager` extracts `topology` from `mergedConfig`.
2. **Apply**: `EngineState.setTopology()` is called *once* during transition.
3. **Physics Reset**: Gravity and Damping are reapplied.

## 5. SAFEGUARDS
- **Lock**: Topology changes require a Scene Reload to re-initialize physics bodies correctly.
- **Normalization**: Input vectors are always normalized before reaching the topology solver.