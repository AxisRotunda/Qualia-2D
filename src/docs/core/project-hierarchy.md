
# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point, Tailwind & Import Maps.
- `metadata.json`: Engine metadata and permissions.

## /src
- `app.component.ts`: Root UI Orchestrator.
- `app.component.html`: High-level Layout.

### /src/app/ui (Modular HUD)
- `viewport.component.ts`: Canvas & Raw Input isolation.
- `telemetry.component.ts`: Real-time engine readout.
- `command-hub.component.ts`: Main navigation island.
- `inspector.component.ts`: Property mutation engine.

### /src/engine
- `ecs/`:
  - `entity.ts`: ID generation logic.
  - `components.ts`: Component interfaces.
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
- **protocols/**: Operational logic definitions.
- **visual/**: Design language documentation.
- **history/**: Memory logs.
