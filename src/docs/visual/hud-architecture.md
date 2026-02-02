# [T1] HUD Architecture: Spatial Layout
ID: VISUAL_LAYOUT_V1.0 | Role: Structural Blueprint.

## 1. THE Z-AXIS HIERARCHY
1. **Z-50 (Modal/Overlay)**: Full-screen loaders, critical alerts.
2. **Z-40 (Command Hub)**: The primary floating action island.
3. **Z-30 (Telemetry Pill)**: Floating status instruments.
4. **Z-20 (Contextual HUD)**: Localized labels/tools (e.g., selection menus).
5. **Z-10 (Drawers)**: Side panels (Hierarchy, Inspector).
6. **Z-0 (Viewport)**: The simulation canvas.

## 2. PRIMARY REGIONS
- **The Floating North (Telemetry)**: 
  - `Top: 1.5rem`, `Left: 50%`, `Translate-X: -50%`.
  - Contains FPS, Entity Count, Mode indicator.
- **The Command Anchor (Hub)**:
  - `Bottom: 2.5rem`, `Left: 50%`, `Translate-X: -50%`.
  - The "Thumb Zone". Max height 5rem. 
- **The Lateral Drawers**:
  - `Width: 20rem (Mobile) / 24rem (Desktop)`.
  - Animate via `translate-x` only. Must include `backdrop-blur`.

## 3. PADDING & GUTTERS
- **Global Inset**: `1.5rem` (24px) for all floating elements.
- **Panel Internal**: `2rem` (32px) for header spacing.
- **Touch Target**: Minimum `3rem x 3rem` (48px) for all primary interaction buttons.
