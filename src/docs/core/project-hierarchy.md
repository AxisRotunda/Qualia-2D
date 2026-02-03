# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `README.md`: GitHub Entry Point.
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
- `hud/`: Telemetry, Command Hub, Overlays, Joypads.
- `panels/`: Hierarchy, Inspector, Settings, Drawer.
- `main-menu/`: Full-screen navigation and guides.

### /src/data (Resource & Content Layer)
- `guides/`: Human-readable documentation fragments.
- `scenes/`: Procedural reality fragments.
- `prefabs/`: Entity templates and blueprints.

### /src/engine (Core Simulation Module)
- `ecs/`: Entity and Component stores.
- `core/`: Irreducible atoms.
  - `physics-engine.service.ts`: Rapier2D Wrapper.
  - `camera.service.ts`: Projection Matrix.
  - `asset-registry.service.ts`: Resource Cache.
  - `gesture-oracle.service.ts`: **[NEW]** Input Automaton (LUT).
  - `kalman-filter.service.ts`: **[NEW]** Prediction (SIMD-Mimic).
- `systems/`: Logic processors (Physics, Render, Selection, Controller).
- `factory/`: Instantiation logic (EntityFactory).
- `runtime/`: The high-frequency RAF loop.

### /src/services (Orchestration Layer)
- `engine-2d.service.ts`: Primary Bridge (UI <-> Engine).
- `state-2d.service.ts`: Global Signal-state registry.
- `input-2d.service.ts`: Hardware-to-Intent translation.
- `scene-manager.service.ts`: Reality fragment lifecycle.
- `runtime-2d.service.ts`: Engine tick coordination.
- `mutation-2d.service.ts`: State mutation commands.
- `spawner-2d.service.ts`: Entity placement logic.

### /src/docs (Logic & Protocol Kernel)
- `kernel/`: Structural foundations.
- `protocols/`: Operational verb definitions.
  - `protocol-hyper-core.md`: **[NEW]** Optimization laws.
- `agent-ops/`: Context Packs for External AI Agents.
- `engine/`: Deep architectural dives (ECS, Physics, Render, Input, Scenes, Camera).
- `visual/`: Obsidian Glass design language.
- `history/`: Session memory and repair logs.