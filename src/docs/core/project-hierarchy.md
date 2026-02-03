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
- `hud/`: Telemetry, Command Hub, Overlays, Joypads, Selection Toolbar.
- `panels/`: Hierarchy, Inspector, Settings, Drawer.
- `main-menu/`: Full-screen navigation and guide sub-components.

### /src/data (Resource & Content Layer)
- `guides/`: Human-readable documentation fragments (VisualArticles).
- `scenes/`: Procedural reality fragments (ScenePresets).
- `prefabs/`: Entity templates and blueprints.

### /src/engine (Core Simulation Module)
- `ecs/`: Entity and Component stores.
- `core/`: Irreducible atoms.
  - `physics-engine.service.ts`: Rapier2D Wrapper.
  - `camera.service.ts`: Projection & Prediction.
  - `asset-registry.service.ts`: Resource Cache.
  - `gesture-oracle.service.ts`: **[HYPER-CORE]** Gesture Automaton (LUT).
  - `kalman-filter.service.ts`: **[HYPER-CORE]** SIMD-Mimic Prediction.
- `systems/`: Logic processors (Physics, Render, Selection, Controller).
- `factory/`: Instantiation logic (EntityFactory).
- `runtime/`: The high-frequency RAF loop.

### /src/services (Orchestration Layer)
- `engine-2d.service.ts`: Primary Bridge (UI <-> Engine).
- `state-2d.service.ts`: Global Signal-state registry.
- `input-2d.service.ts`: Hardware-to-Intent translation.
- `memory-2d.service.ts`: **[NEW]** Tiered Memory System.
- `scene-manager.service.ts`: Reality fragment lifecycle.
- `runtime-2d.service.ts`: Engine tick coordination.
- `mutation-2d.service.ts`: State mutation commands.
- `spawner-2d.service.ts`: Entity placement logic.

### /src/docs (Logic & Protocol Kernel)
- `kernel/`: Structural foundations and Axial Directives.
- `protocols/`: Operational verb definitions.
- `engine/`: Architectural dives (ECS, Physics, Render, Input, Hyper-Core, Memory).
- `visual/`: Obsidian Glass design tokens and HUD rules.
- `history/`: Session memory, Narrative Log, and Repair Traces.
- `agent-ops/`: Task-specific context packs for external AI.