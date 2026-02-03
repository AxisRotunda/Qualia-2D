# [T0] Engine Lifecycle: The Pulse
ID: ENGINE_LIFECYCLE_V1.0 | Role: Runtime Coordination.

## 1. OVERVIEW
Qualia2D operates on a high-frequency, asynchronous game loop decoupled from the Angular change detection cycle (Zoneless). This document maps the sequence of events from raw hardware RAF to the final render pass.

## 2. THE TICK SEQUENCE
The `GameLoopService` triggers the `Runtime2DService.tick(dt)` every frame.

### 01: INPUT SYNC
- Hardware events (Mouse/Touch/Keys) are normalized by `Input2DService`.
- Intent vectors (Move/Look) are calculated for the `ControllerSystem`.

### 02: SYSTEM PRE-STEP (FORCES)
- `PhysicsSystem2DService.applyForces` iterates `ForceField2D` components.
- `PhysicsSystem2DService.applyDraggingForces` handles active user interaction.

### 03: PHYSICS STEP
- `ControllerSystem2DService` applies impulses to player entities.
- `PhysicsEngine.step(dt)` advances the Rapier2D world.
- `PhysicsEngine.syncTransformsToECS` updates `Transform2D` components from WASM state.

### 04: CAMERA UPDATES
- `CameraService` performs smoothing/lerping if following an entity.

### 05: RENDER PASS
- `RenderSystem` draws the current ECS state to the Canvas2D context.

## 3. PERFORMANCE METRICS
- **Target Frequency**: 60Hz - 120Hz (Display Dependent).
- **Zoneless CD**: Angular's change detection is **never** triggered by the game loop.
- **Telemetry**: State updates are sampled and stored in `EngineState2DService` signals for UI display.

## 4. SAFEGUARDS
- **Time Cap**: Delta time (dt) is capped at 100ms to prevent "Spirals of Death" on frame drops.
- **WASM Boundary**: Data transfer between JS and WASM is minimized to transform syncing only.
