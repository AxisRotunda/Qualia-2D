# [T1] Camera & Projection: The Viewport Lens
ID: ENGINE_CAMERA_V1.0 | Role: Visual Translation.

## 1. OVERVIEW
The `CameraService` serves as the mathematical bridge between the simulation's world-space coordinates and the user's screen-space pixels. It manages the viewport "lens" through which the 2D reality is observed.

## 2. COORDINATE MATRICES

### [M0] WORLD SPACE
- **Scale**: Meters (arbitrary).
- **Orientation**: Cartesian (+Y is Up).
- **State**: `x()`, `y()`, `zoom()`.

### [M1] SCREEN SPACE
- **Scale**: Pixels.
- **Orientation**: Raster (+Y is Down).
- **Origin**: Canvas Top-Left (0, 0).

## 3. PROJECTION LOGIC
Projection is handled in `RenderSystem` and `CameraService`.

### SCREEN TO WORLD (INPUT)
Used for picking and cursor tracking.
1. `(ScreenX - HalfWidth) / Zoom + CamX`
2. `-( (ScreenY - HalfHeight) / Zoom - CamY )`

### WORLD TO SCREEN (RENDER)
Used for determining where an entity appears.
1. `(WorldX - CamX) * Zoom + HalfWidth`
2. `-(WorldY - CamY) * Zoom + HalfHeight`

## 4. DYNAMIC BEHAVIORS

### [D0] ENTITY FOLLOWING
The camera supports lerp-based following of a target `EntityId`.
- **Logic**: `CurrentPos + (TargetPos - CurrentPos) * LerpFactor`.
- **LerpFactor**: Frame-rate independent: `1 - pow(1 - smoothing, dt * 60)`.

### [D1] ZOOM CLAMPING
To prevent visual artifacts and floating-point errors at extreme scales:
- **Min**: 5 units (Extreme Out).
- **Max**: 500 units (Microscopic In).

## 5. INVARIANTS
1. **Viewport Centrality**: The camera always considers `halfWidth, halfHeight` of the canvas as the origin of its transformation.
2. **Y-Inversion**: The camera is responsible for the final inversion of the Y-axis to bridge Cartesian and Raster systems.
3. **Stateless Render**: The `RenderSystem` must only read camera signals, never mutate them.