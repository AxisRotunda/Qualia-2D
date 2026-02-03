# [T1] Sprite Protocol: 2D Representation
ID: PROTOCOL_SPRITE_V1.0 | Role: Planar Projection Governance.

## 1. INTENT
Govern the 2D visual representation of entities, including texture mapping, flipping, and scaling. This aligns Qualia2D with industry-standard sprite handling (e.g., Godot AnimatedSprite2D).

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 COMPONENT SCHEMA
The `Sprite2D` component must handle:
- `textureId`: Key for `AssetRegistryService`.
- `flipX / flipY`: Boolean flags for directional orientation.
- `width / height`: Physical world units (not pixels).
- `layer`: Z-index equivalent for planar sorting.

### 2.2 RENDERING INVARIANTS
- **Center Pivot**: All sprites are drawn from the center `(0,0)` of the entity.
- **Unit Scaling**: Sprite size is defined in meters, projected to pixels via `CameraService.zoom()`.

## 3. LOGIC MATRIX: RUN_SPRITE [ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **FETCH** | Verify `textureId` exists in the `AssetRegistryService`. |
| 02 | **ORIENTATION** | Apply `flipX` if moving left, `flipY` for inverted gravity states. |
| 03 | **SORTING** | Verify `layer` does not conflict with UI overlays (Z-30+). |

## 4. INDUSTRY STANDARDS
- **Y-Sort**: For top-down topologies, `layer` should be dynamically calculated as `Math.floor(-y * 100)`.
- **Smoothing**: Use `imageSmoothingEnabled = false` for pixel-art assets to maintain crispness.

## 5. SAFEGUARDS
- **Texture Guard**: If `textureId` fails, fallback to `color` property immediately.
- **Scale Guard**: Width/Height must be `> 0` to prevent canvas draw errors.