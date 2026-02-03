# [T1] Rendering Pipeline: Planar Projection
ID: ENGINE_RENDER_V1.0 | Role: Visual Synthesis.

## 1. THE STACK: CANVAS2D
Qualia2D uses a stateless `RenderSystem` that projects the ECS state onto a HTML5 Canvas. Rendering is decoupled from the DOM to ensure 60FPS performance even with high entity counts.

## 2. COORDINATE SYSTEMS

### [C0] WORLD SPACE
- **Origin**: `0, 0` at the center of the simulated reality.
- **Y-Axis**: Up is Positive (+Y).
- **Units**: Arbitrary physics units (standardly 1 unit = 1 meter).

### [C1] SCREEN SPACE
- **Origin**: `0, 0` at the Top-Left of the canvas.
- **Y-Axis**: Down is Positive (+Y).
- **Units**: Pixels.

## 3. THE RENDER PASS
Executed every tick by `RenderSystem.render()`:
1. **CLEAR**: Clear canvas with `EngineState2DService.bgColor`.
2. **GRID**: Draw coordinate grid (if enabled) relative to camera offset.
3. **TRANSFORM**: Apply `halfW, halfH` translation (Center Origin) and `scale(zoom, -zoom)` (Invert Y).
4. **SORT**: Entities are sorted by `Sprite2D.layer`.
5. **DRAW**:
   - Translate to Entity Pos.
   - Rotate by Entity Rotation.
   - Draw Sprite (Texture or Solid).
   - Draw Force Field indicators.
   - Draw Selection Highlight.
6. **OVERLAY**: Draw drag leashes and debug collision hulls.

## 4. PERFORMANCE HEURISTICS
- **Draw Call Batching**: Currently limited by Canvas2D. Prefer larger textures over many small primitives.
- **Frustum Culling**: Entities outside the camera's viewport should ideally skip the `DRAW` phase (To be implemented).