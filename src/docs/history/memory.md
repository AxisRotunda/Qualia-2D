# Memory Log

## [Init] Qualia2D Genesis
- **Action**: Initial system synthesis.
- **Context**: Porting Qualia3D concepts to 2D plane.
- **Outcome**: 
  - Zoneless Angular shell established.
  - Rapier2D WASM integration verified.
  - ECS Store operational (Map-based).
  - Canvas 2D Renderer with double-buffering logic.
  - Basic editor controls (Pan/Zoom/Inspect).

## [Refactor] Scene Architecture
- **Action**: Decoupling hardcoded scenes.
- **Change**: Introduced `ScenePreset2D` interface and `scene-presets.ts`.
- **Impact**: Engine can now switch contexts dynamically between Playground and Tower tests.
