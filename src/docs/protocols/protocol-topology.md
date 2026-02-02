# [T0] Topology Protocol
ID: PROTOCOL_TOPOLOGY_V1.1 | Role: Physics Context Management.

## 1. INTENT
Govern the engine's behavior across different Physics Modes (Platformer, Top-Down, Zero-G).

## 2. HARD STRUCTURAL DEFINITIONS
- **Physics Mode Signal**: `EngineState2DService.physicsMode`.
- **Modes**:
  1. `platformer`: Gravity -Y (Variable). Ground Friction. Impulse-based Jump.
  2. `top-down`: Zero Gravity. High Linear Damping (0.90). Snappy movement.
  3. `zero-g`: Zero Gravity. Low Linear Damping (0.995). Newtonian Inertia.

## 3. LOGIC MATRIX
1. **Switch Mode**: Immediately reset `world.gravity`.
2. **Apply Damping**: In `tick()`, iterate all dynamic bodies and scale velocity by `factor` if not in platformer mode.
3. **Controller Tick**: Map active keyboard keys to force vectors based on the active mode (Impulse vs Thruster).

## 4. INDUSTRY STANDARDS
- **Normalization**: Movement vectors must be normalized before applying strength to prevent diagonal speed-boost exploits.
- **Time Correction**: Damping should be frame-rate independent `vel *= pow(factor, dt)`.

## 5. SAFEGUARDS
- **Reset Guard**: Switching modes does not auto-reset scene, but scene loading forces the intended mode.