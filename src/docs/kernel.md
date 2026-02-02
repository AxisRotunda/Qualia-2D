# Qualia2D Kernel Index [T0]

## [T0] Structural Map
This document serves as the root entry point for the Qualia2D constitutional logic. All sub-processes must align with the definitions linked below.

### 1. Core Directives
- **[Axial Directives](./kernel/axial-directives.md)**: Irreducible principles of the engine (Applet Priority, Automation Bias, Processual Identity).
- **[Safeguards](./kernel/safeguards.md)**: Hard boundaries, WASM safety, and the absolute prohibition of GenAI integration.

### 2. Operational Logic
- **[Command Registry](./kernel/command-registry.md)**: Mapping of operational verbs (RUN_PHYS, RUN_UI, etc.) to protocol behaviors.
- **[Project Hierarchy](../core/project-hierarchy.md)**: Hard file-system mapping for agent navigation.

### 3. Human Experience
- **[Aesthetic Index](../visual/aesthetic.md)**: Visual identity root.
- **[Design Tokens](../visual/tokens.md)**: Colors, Typography, and Blur primitives.
- **[Layout Architecture](../visual/hud-architecture.md)**: Spatial positioning and HUD rules.
- **[Interaction Patterns](../visual/motion.md)**: Feedback, Motion, and Gesture logic.

## Invariants
- **Determinism**: The simulation core is deterministic.
- **ECS Authority**: Entity Component System is the single source of truth.
- **Stateless Rendering**: Renderer projects state; it does not hold it.
