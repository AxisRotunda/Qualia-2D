# Qualia2D Kernel Index [T0]

## [T0] Structural Map
This document serves as the root entry point for the Qualia2D constitutional logic. All sub-processes must align with the definitions linked below.

### 0. The Vision
- **[Qualia2D Manifesto](./qualia2d-manifesto.md)**: The philosophical and technical vision for the engine.

### 1. Core Directives
- **[Axial Directives](./kernel/axial-directives.md)**: Irreducible principles of the engine.
- **[Safeguards](./kernel/safeguards.md)**: Hard boundaries and WASM safety.

### 2. Operational Logic
- **[Command Registry](./kernel/command-registry.md)**: Mapping of operational verbs.
- **[Project Hierarchy](../core/project-hierarchy.md)**: Hard file-system mapping.
- **[Knowledge Sync Protocol](./protocols/protocol-knowledge.md)**: Documentation governance.

### 3. Engine Architecture (The Dives)
- **[ECS Architecture](./engine/ecs-architecture.md)**: Data-first state management.
- **[Physics Integration](./engine/physics-integration.md)**: Rapier2D boundary logic.
- **[Rendering Pipeline](./engine/rendering-pipeline.md)**: Planar projection rules.
- **[Engine Lifecycle](./engine/lifecycle.md)**: The high-frequency pulse.
- **[Input Pipeline](./engine/input-pipeline.md)**: Device normalization logic.
- **[Hyper-Core & Prediction](./engine/hyper-core.md)**: Kalman Filter & Gesture Oracle.
- **[Memory Tiering](./engine/memory-tiering.md)**: Cognitive stratification.
- **[Scene Lifecycle](./engine/scene-lifecycle.md)**: Reality fragment management.
- **[Camera & Projection](./engine/camera-projection.md)**: Coordinate translation laws.

### 4. Human Experience
- **[Aesthetic Index](../visual/aesthetic.md)**: Visual identity root.
- **[Design Tokens](../visual/tokens.md)**: Colors and Material properties.
- **[HUD Architecture](../visual/hud-architecture.md)**: Spatial layout rules.
- **[Interaction Patterns](../visual/motion.md)**: Motion and Feedback.

## Invariants
- **Determinism**: Physics core is WASM-backed and deterministic.
- **Zoneless**: No Angular zones allowed.
- **SSOT**: Component Store is the only valid source of entity state.
- **Predictive**: Input and Camera utilize Kalman Fusion to eliminate perceived latency.