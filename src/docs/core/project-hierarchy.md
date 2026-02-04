# Project Hierarchy: Qualia2D Hard Mapping
ID: HIERARCHY_V2.0 | Role: Structural Truth.

## 1. ROOT ARCHITECTURE
- `index.html`: Entry point & ESM Import Map.
- `index.tsx`: Angular bootstrap (Zoneless).
- `metadata.json`: Applet permissions & metadata.
- `manifest.json`: PWA Manifest.
- `service-worker.js`: Cache persistence.
- `README.md`: High-level overview.

## 2. /src/app (View Layer)
- `app.component.ts`: Root Orchestrator.
- `app.component.html`: Spatial layout regions.
- `ui/`:
  - `viewport/`: `viewport.component.ts` (Canvas bridge).
  - `hud/`: `telemetry`, `command-hub`, `virtual-joypad`, `selection-toolbar`, `log-viewer`.
  - `panels/`: `panel-drawer`, `hierarchy`, `inspector`, `engine-settings`, `scene-inspector`.
  - `overlays/`: `main-menu`, `scene-browser`, `create-menu`, `dialog-overlay`.
  - `main-menu/`: `play-tab`, `guide-tab`, `settings-tab`, `launch-modal`, `projects-tab`, `guide-detail`.

## 3. /src/services (Orchestration)
- `engine-2d.service.ts`: Primary Façade.
- `engine-state-2d.service.ts`: UI State Signals.
- `camera-2d.service.ts`: Viewport Projection.
- `input-2d.service.ts`: Hardware Normalization.
- `scene-manager.service.ts`: Fragment Transitions.
- `runtime-2d.service.ts`: Tick Orchestrator.
- `mutation-2d.service.ts`: ECS Write Operations.
- `spawner-2d.service.ts`: High-Volume Instantiation.
- `selection-2d.service.ts`: Spatial Queries.
- `memory-2d.service.ts`: Tiered Cognitive Memory.
- `command-registry.service.ts`: Verb Management.
- `project.service.ts`: Multi-Project Persistence.
- `game-session.service.ts`: RPG State (Gold, XP, Flags).
- `documentation.service.ts`: Guide Provider.
- `storage.service.ts`: LocalStorage Adapter.
- `pwa.service.ts`: Native Class Bridge.

## 4. /src/engine (Logic Core)
- `ecs/`: `entity.ts`, `components.ts`, `component-store.service.ts`.
- `core/`: `physics-engine.service.ts`, `asset-registry.service.ts`, `gesture-oracle.service.ts`, `kalman-filter.service.ts`.
- `factory/`: `entity-factory.service.ts`.
- `runtime/`: `game-loop.service.ts`.
- `systems/`: `render-system.ts`, `physics-system.service.ts`, `controller-system.service.ts`, `player-system.ts`, `animation-system.ts`, `interaction-system.ts`.
- `scene.types.ts`: Engine types.

## 5. /src/data (Static State)
- `scene-presets.ts`: Registry.
- `scenes/`: `neon-hotline`, `physics-lab`, `ghost-village`, `kinetic-chaos`.
- `prefabs/`: `entity-blueprints.ts`.
- `guides/`: `index.ts`, `kinetic-translation`, `physics-laws`, `interface-logic`, `forces-dynamics`, `memory-stratification`, `player-mastery`, `guide-to-guides`.
- `config/`: `visual-config`, `animation-config`, `topology-config`, `player-config`.
- `assets/`: `procedural-textures.ts`.

## 6. /src/docs (Knowledge Kernel)
- `kernel.md`: Index.
- `qualia2d-manifesto.md`: Vision.
- `kernel/`: `axial-directives.md`, `safeguards.md`, `command-registry.md`.
- `protocols/`: `refactor`, `constructor`, `knowledge`, `optimize`, `repair`, `ui`, `dynamics`, `material`, `scene-optimizer`, `forces`, `industry`, `topology`, `pwa`, `spawning`, `archetype`, `hyper-core`, `rpg`, `visual-core`, `project`, `memory-shard`.
- `history/`: `memory.md`, `memory.json`.
- `repair-logs/`: Issue traces.
- `meta-rules/`: Proven Patterns.
- `engine/`: Lifecycle, ECS, Physics, Render, Input, Scene, Camera, Hyper-Core, Narrative, Memory.
- `visual/`: Aesthetic, Tokens, HUD, Motion, Blueprints.

## 7. SAFEGUARDS
- **Deprecation Ban**: No file in this list may be deleted or modified such that its core intent is lost without a corresponding `RUN_KNOWLEDGE` audit.
- **SIH Lock**: Major files must match registry hashes.

STRUCTURAL_HASH: QUALIA_HIERARCHY_2.0_7F2A1