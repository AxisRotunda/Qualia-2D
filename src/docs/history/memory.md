
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

## [v1.1] Manipulation & Debug Update
- **Action**: Enhanced interactivity and developer tooling.
- **Changes**:
  - Implemented **Entity Dragging** in Edit mode: Synchronizes ECS Transform and Rapier RigidBody translation.
  - Added **Physics Debug Mode**: Visualizes colliders as magenta wireframes via `Renderer2DService`.
  - Expanded **Inspector**: Real-time dimension editing and name updates.
  - Added **Domino Run** Scene: Demonstrates physics stability and collision chaining.
  - Fixed: Gravity now updates correctly during active simulation.
- **Impact**: The engine now functions as a basic level editor, not just a viewer.
