# [T0] Dynamics Protocol
ID: PROTOCOL_DYNAMICS_V1.0 | Role: Physics Tuning.

## 1. INTENT
Calibrate the Rapier2D world for high-fidelity deterministic simulation.

## 2. PARAMETERS
- **Gravity**: Global `gravityY` from `EngineState2DService`.
- **Sub-stepping**: Logic for fixed-time steps vs variable frame rates.
- **Material Friction**: Default coefficient 0.5.

## 3. LOGIC
1. Sync `Transform2D` back to RAPIER if `edit` mode dragging occurs.
2. Ensure `step()` is called only when `mode === 'play'`.
3. Validate collider integrity on entity resize.