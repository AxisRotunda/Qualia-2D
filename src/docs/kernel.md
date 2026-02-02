
# Qualia2D Kernel (Tier 0)

## Axial Laws
1. **Determinism**: The simulation core is deterministic. Given the same initial state and inputs, the physics outcome is identical.
2. **Fixed-Step Simulation**: Physics runs on a fixed accumulator (e.g., 60hz). Visuals are interpolated or extrapolated only if needed, but the ground truth is the physics step.
3. **ECS Authority**: The Entity Component System (ECS) is the single source of truth for game state.
4. **Physics Authority**: In `PLAY` mode, Rapier2D dictates transform mutations. In `EDIT` mode, the Editor/User inputs dictate transform mutations.
5. **Stateless Rendering**: The `Renderer2DService` retains no state between frames. It purely projects the current ECS state onto the Canvas.

## Invariants
- **Transform Flow (Play)**: Physics World -> RigidBody -> ECS Transform Component -> Renderer.
- **Transform Flow (Edit)**: Gizmo/Input -> ECS Transform Component -> RigidBody (teleport).
- **Mutations**: Direct ECS store mutation is forbidden for external consumers. All state changes must proceed through `Engine2DService` or specific Feature Services.
