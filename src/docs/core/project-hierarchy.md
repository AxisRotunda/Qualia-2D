# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point, Tailwind & Import Maps.
- `metadata.json`: Engine metadata and permissions.
- `manifest.json`: PWA Manifest.
- `service-worker.js`: Offline caching.

## /src
- `app.component.ts`: Root UI Orchestrator.
- `app.component.html`: High-level Layout.

### /src/app/ui (Modular HUD)
- `viewport.component.ts`: Canvas & Raw Input isolation.
- `telemetry.component.ts`: Real-time engine readout.
- `command-hub.component.ts`: Main navigation island.
- `inspector.component.ts`: Property mutation engine.
- `virtual-joypad.component.ts`: Floating mobile touch interface.

### /src/engine
- `ecs/`: Entity and Component stores.
- `factory/`: Template instantiation services.
- `systems/`: Physics and Controller logic.
- `runtime/`: RAF-based loop.
- `scene.types.ts`: Scene definition interfaces.

### /src/services
- `engine-2d.service.ts`: Main engine orchestrator.
- `engine-state-2d.service.ts`: Session and metadata signals.
- `camera-2d.service.ts`: Camera state and math.
- `input-2d.service.ts`: Input registry and interaction state.
- `physics-2d.service.ts`: Rapier2D WASM wrapper.
- `renderer-2d.service.ts`: Canvas2D rendering system.
- `scene-manager.service.ts`: Scene loading logic.
- `command-registry.service.ts`: T0 Verb execution logic.
- `asset-registry.service.ts`: Texture and asset lifecycle manager.
- `pwa.service.ts`: (NEW) App installation and lifecycle.

### /src/docs
- `kernel/`: Structural foundations.
- `protocols/`: Operational logic definitions.
- `visual/`: Design language documentation.
- `history/`: Memory logs.