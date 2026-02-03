# [T1] Visual Core Protocol: Environment & Atmosphere
ID: PROTOCOL_VISUAL_CORE_V1.0 | Role: Environmental Rendering.

## 1. INTENT
Overhaul the engine's background rendering to support Industry Standard "Hard Realism" aesthetics. Move beyond flat colors to atmospheric gradients and procedural vignettes.

## 2. THE RENDER STACK UPDATE

### 2.1 BACKGROUND LAYERS
1. **Base Fill**: The fundamental void color (e.g., `#020617`).
2. **Atmosphere**: A vertical linear gradient simulating a horizon or depth.
3. **Grid**: Procedural coordinate lines with alpha blending.
4. **Vignette**: Radial gradient to focus attention on the center (Post-Process simulation).

## 3. CONFIGURATION INJECTION
The `RenderSystem` must consume the `SceneConfig.env` object provided by the `SceneManager`.
- **Constraint**: Render logic must handle missing config values gracefully (fallback to default Obsidian tokens).

## 4. LOGIC MATRIX: RUN_ENV [SCENE_ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **READ** | Access `EngineState.envConfig`. |
| 02 | **COMPOSE** | Create Canvas2D `Gradient` objects based on `background` and `horizon` colors. |
| 03 | **DRAW** | Fill screen rect. Draw Grid with `gridOpacity`. |

## 5. VISUAL TOKENS (DEFAULTS)
- **Void**: `#020617` (Obsidian)
- **Horizon**: `#1e1b4b` (Midnight)
- **Grid**: `#ffffff` @ 0.05 Opacity

## 6. SAFEGUARDS
- **Performance**: Gradients are expensive. Cache the `CanvasGradient` object if the camera hasn't resized.
- **Context**: Ensure `ctx.save()` / `ctx.restore()` wraps the background pass to prevent style leakage.