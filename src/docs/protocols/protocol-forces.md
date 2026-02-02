# [T0] Forces Protocol
ID: PROTOCOL_FORCES_V1.0 | Role: Dynamic Influence Management.

## 1. INTENT
Govern the implementation and behavior of non-collision physical forces (Gravity Wells, Wind, etc.) within the engine.

## 2. HARD STRUCTURAL DEFINITIONS
- **Component**: `ForceField2D` containing `strength`, `radius`, and `active` state.
- **Execution**: Forces must be applied *before* the physics step in the main tick.
- **Safety**: Force vectors must be normalized before scaling by strength to prevent "Infinite Velocity" errors at distance 0.

## 3. LOGIC MATRIX
1. **Iterate**: Find all entities with `ForceField2D`.
2. **Filter**: Identify `dynamic` rigid bodies within `field.radius`.
3. **Calculate**: `Vector = EntityPos - FieldPos`.
4. **Normalize**: Protect against Zero-Length vectors.
5. **Apply**: `body.applyImpulse(NormalizedVector * field.strength * dt)`.

## 4. VISUAL GUIDELINES
- **Attraction**: Indigo pulsing rings.
- **Repulsion**: Rose pulsing rings.
- **Active State**: Pulsing frequency tied to `strength`.

## 5. SAFEGUARDS
- **Distance Guard**: Ignore entities where `distance < 0.1` to prevent physics glitches.
- **Magnitude Cap**: Cap the max impulse per frame to avoid "Entity Tunneling".