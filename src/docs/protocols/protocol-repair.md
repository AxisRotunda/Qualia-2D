# [T0] Repair Protocol
ID: PROTOCOL_REPAIR_V1.0 | Role: Stability Restoration.

## 1. INTENT
Recover the engine from catastrophic states (Physics explosions, NaN leakage, UI deadlocks).

## 2. DIAGNOSTIC BRANCHES
### BRANCH A: PHYSICS_EXPLOSION
- **Detect**: `Number.isNaN()` in ECS Transforms.
- **Action**: Reset world state, clear `RigidBody` handles, and reload the scene.

### BRANCH B: UI_STALL
- **Detect**: Active panel state contradicts DOM presence.
- **Action**: Force reset `EngineState2DService.activePanel` to 'none'.

## 3. SAFEGUARDS
- Log all repairs in `src/docs/history/repair-logs/`.
- Validate WASM heap integrity if RAPIER crashes.