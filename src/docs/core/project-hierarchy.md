# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point (Tailwind).
- `metadata.json`: Engine metadata.

## /src
- `app.component.ts`: Root UI Orchestrator.

### /src/app/ui (Modular View Layer)
- `viewport/`: Canvas isolation.
- `hud/`: Telemetry, Command Hub, Overlays, Joypads.
- `panels/`: Hierarchy, Inspector, Settings.
- `main-menu/`: Full-screen navigation.

### /src/data (Resource Layer)
- `guides/`: Human-readable documentation.
- `scenes/`: Procedural fragments.
- `prefabs/`: Entity templates.
- `config/`: **[NEW]** Physics, Visual, and Player constants.

### /src/engine (Core Simulation)
- `ecs/`: Entity and Component stores.
- `core/`: Physics, Camera, Assets, Kalman, Oracle.
- `systems/`: 
  - `player-system.ts`: Pilot logic.
  - `render-system.ts`: Pass-based renderer.
  - `animation-system.ts`: RPG flipbooks.
  - `interaction-system.ts`: RPG triggers.
- `runtime/`: High-frequency loop.

### /src/services (Orchestration Layer)
- `engine-2d.service.ts`: Primary Bridge.
- `game-session.service.ts`: **[NEW]** RPG Persistence.
- `memory-2d.service.ts`: Tiered Memory.

### /src/docs (Logic Kernel)
- `kernel/`: Structural foundations.
- `protocols/`: Operational verbs (RUN_RPG_SYS, etc).
- `engine/`: Architectural dives (ECS, Physics, Narrative).
- `visual/`: Design tokens and HUD rules.
- `history/`: Memory logs and repair traces.