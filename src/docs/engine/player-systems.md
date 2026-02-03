# [T1] Player Systems: Control & Pilot Logic
ID: ENGINE_PLAYER_V1.0 | Role: Agency Implementation.

## 1. OVERVIEW
Qualia2D separates player agency from generic entity physics through the `PlayerSystem`. This ensures that user control feels responsive and "curated" rather than purely reactive.

## 2. THE PILOT PIPELINE
The control flow for a player-tagged entity follows this sequence:
1. **INPUT**: `Input2DService` captures hardware deltas and normalizes them into `moveVector` and `lookVector`.
2. **CALIBRATION**: `PlayerSystem` retrieves the physical constants from `player-config.ts` based on the active `ControllerTopology`.
3. **IMPULSE**: The system applies refined forces to the Rapier2D `RigidBody`:
   - **Platformer**: Uses a horizontal target velocity with vertical impulse for jumping.
   - **RPG**: Uses a hard velocity cap for grid-like snappiness.
   - **Action**: Uses angular lerping for aiming and cumulative impulses for high-speed maneuvering.

## 3. CONFIGURATION (src/data/config/player-config.ts)
| Property | Description |
| :--- | :--- |
| `moveSpeed` | Target velocity in world units/sec. |
| `acceleration` | Rate of approach to target velocity. |
| `deceleration` | Scaling factor applied when no input is present. |
| `jumpForce` | Initial vertical impulse for platforming. |
| `rotationSpeed` | Speed of angular alignment towards aim target. |

## 4. TOPOLOGY MAPPING
Player behavior shifts dynamically with the engine's topology:
- **Axis-Locked**: Platformers lock rotation to 0.
- **Directional**: RPGs snap to 8-way movement.
- **Fluid**: Action modes decouple movement from orientation.

## 5. SAFEGUARDS
- **Jitter Guard**: Velocity updates are damped to prevent physics solver explosions.
- **Ground Check**: Jump impulses in platformers are gated by a vertical velocity threshold (~0.1).
- **Zoneless**: Input changes emit signals that the `PlayerSystem` consumes during the high-frequency tick.