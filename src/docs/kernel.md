# Qualia2D Kernel Index [T0]

## [T0] Structural Map
This document serves as the root entry point for the Qualia2D constitutional logic.

### 0. The Vision
- **[Qualia2D Manifesto](./qualia2d-manifesto.md)**: The philosophical vision.

### 1. Core Directives
- **[Axial Directives](./kernel/axial-directives.md)**: Irreducible principles.
- **[Safeguards](./kernel/safeguards.md)**: Hard boundaries.

### 2. Operational Logic
- **[Command Registry](./kernel/command-registry.md)**: Mapping of operational verbs.
- **[Project Hierarchy](./core/project-hierarchy.md)**: Hard file-system mapping (V2.0).

### 3. Engine Architecture (The Dives)
- **[ECS Architecture](./engine/ecs-architecture.md)**: Data-first state.
- **[Physics Integration](./engine/physics-integration.md)**: Rapier2D logic.
- **[Narrative Engine](./engine/narrative-engine.md)**: RPG & Session persistence.
- **[Engine Lifecycle](./engine/lifecycle.md)**: The high-frequency pulse.
- **[Hyper-Core](./engine/hyper-core.md)**: Prediction & Latency.

### 4. Human Experience
- **[Aesthetic Index](./visual/aesthetic.md)**: Visual identity root.
- **[HUD Architecture](./visual/hud-architecture.md)**: Spatial layout rules.
- **[Interaction Patterns](./visual/motion.md)**: Motion and Feedback.

### 5. Memory & Sharding
- **[Memory Tiering](./engine/memory-tiering.md)**: Cognitive layers.
- **[Sharding Protocol](./protocols/protocol-memory-shard.md)**: Long-term history management.

## Invariants
- **Determinism**: WASM-backed physics.
- **Zoneless**: No Angular zones.
- **SSOT**: ECS is the only source of truth.
- **Persistence**: Project-level state survives purge.