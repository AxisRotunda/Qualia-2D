# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point (Tailwind + Import Maps).
- `metadata.json`: Engine metadata.
- `manifest.json`: PWA Manifest.
- `service-worker.js`: Offline caching.

## /src
- `app.component.ts`: Root UI Orchestrator.
- `app.component.html`: High-level Layout.

### /src/app/ui (Modular View Layer)
- `viewport/`: Canvas & Interaction isolation.
- `hud/`: Telemetry, Command Hub, Overlays.
- `panels/`: Hierarchy, Inspector, Settings drawers.
- `main-menu/`: Full-screen navigation and guides.

### /src/data (Resource & Content Layer)
- `guides/`: Human-readable documentation fragments.
- `scenes/`: Procedural reality fragments.
- `prefabs/`: Entity templates and blueprints.
- `index.ts`: Barrel export for all engine content.

### /src/engine (Core Simulation Module)
- `ecs/`: Entity and Component stores (The "Memory").
- `systems/`: Logic processors (Physics, AI, Movement).
- `factory/`: Instantiation logic.
- `runtime/`: The high-frequency RAF loop.

### /src/services (Orchestration Layer)
- `engine-2d.service.ts`: Primary Bridge (UI <-> Engine).
- `state-2d.service.ts`: Global Signal-state registry.
- `input-2d.service.ts`: Hardware-to-Intent translation.
- `physics-2d.service.ts`: Rapier2D WASM wrapper.
- `renderer-2d.service.ts`: Canvas2D drawing system.

### /src/docs (Logic & Protocol Kernel)
- `kernel/`: Structural foundations.
- `protocols/`: Operational verb definitions.
- `visual/`: Obsidian Glass design language.
- `history/`: Session memory and repair logs.