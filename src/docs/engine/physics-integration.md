# [T1] Physics Integration: WASM Boundary
ID: ENGINE_PHYSICS_V1.0 | Role: Deterministic Logic.

## 1. THE CORE: RAPIER2D
Qualia2D leverages Rapier2D (WASM) for the simulation core. The integration is designed to maintain high-frequency throughput while bridging the gap between JS garbage collection and WASM heap management.

## 2. THE BOUNDARY LOGIC

### [B0] INITIALIZATION
- **Verb**: `PhysicsEngine.init()`.
- **Constraint**: Must be awaited before any simulation verbs are called.
- **Result**: Creation of `RAPIER.World` and `RAPIER.EventQueue`.

### [B1] TRANSFORM SYNCING (JS -> WASM)
Occurs during the **Input/Pre-Step** phase:
- User dragging/editing triggers `rb.handle.setTranslation()`.
- No interpolation is applied here; the WASM state is forced to match the UI intent.

### [B2] STATE SYNCING (WASM -> JS)
Occurs after `world.step()`:
- `syncTransformsToECS` iterates all `dynamic` bodies.
- `translation()` and `rotation()` are mirrored back to `Transform2D` components.
- **Optimization**: Static bodies are skipped in this pass.

## 3. SPATIAL QUERIES
The physics engine is the primary source of truth for "What is here?".
- **Point Projection**: Used for mouse/touch selection.
- **Shape Intersection**: Used for mobile "Touch Tolerance" with a configurable radius.

## 4. SAFEGUARDS
- **Free Logic**: `reset()` calls `world.free()` to prevent WASM heap fragmentation.
- **NaN Guard**: All values crossing the boundary are checked for finiteness.