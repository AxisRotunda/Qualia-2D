# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point, Tailwind & Import Maps.
- `metadata.json`: Engine metadata and permissions.

## /src
- `app.component.ts`: Root UI Component & Interaction Logic.
- `app.component.html`: View Layer (Human-Centric HUD).

### /src/engine
- `ecs/`:
  - `entity.ts`: ID generation logic.
  - `components.ts`: Component interfaces (Transform, Sprite, Physics).
  - `component-store.service.ts`: Central Signal-based ECS store.
- `runtime/`:
  - `game-loop.service.ts`: RAF-based loop (Outside Angular Zone).
- `scene.types.ts`: Scene definition interfaces.

### /src/services
- `engine-2d.service.ts`: Main engine orchestrator.
- `engine-state-2d.service.ts`: Global Signal-based state.
- `physics-2d.service.ts`: Rapier2D WASM wrapper.
- `renderer-2d.service.ts`: Canvas2D rendering system.
- `command-registry.service.ts`: T0 Verb execution logic.

### /src/docs
- `kernel.md`: High-level manifest & section index.
- **kernel/**:
  - `axial-directives.md`: Core principles (Applet Priority).
  - `safeguards.md`: Prohibitions (No GenAI) and Safety.
  - `command-registry.md`: Operational verb definitions.
- **protocols/**: [NEW]
  - `protocol-constructor.md`: Protocol Genesis/Iteration logic.
  - `refactor-protocol.md`: Refactoring heuristics and AI continuity rules.
  - `protocol-knowledge.md`: Knowledge & Context sync logic.
  - `protocol-optimize.md`: Performance and WASM tuning.
  - `protocol-repair.md`: Stability and error recovery.
  - `protocol-ui.md`: UX/Design language enforcement.
  - `protocol-dynamics.md`: Physics simulation calibration.
  - `protocol-material.md`: Visual and rendering rules.
  - `protocol-scene-optimizer.md`: ECS pruning logic.
- **visual/**:
  - `aesthetic.md`: Human-centric design guidelines (Root).
  - `tokens.md`: Atoms of design (Colors, Blur).
  - `hud-architecture.md`: Spatial layout rules.
  - `motion.md`: UI physics and interaction rules.
  - `blueprints.md`: Skeleton components for expansion.
- **history/**:
  - `memory.md`: Narrative log of development.