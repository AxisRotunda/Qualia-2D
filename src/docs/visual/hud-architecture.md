# [T1] HUD Architecture: Spatial Layout
ID: VISUAL_LAYOUT_V1.1 | Role: Structural Blueprint.

## 1. THE Z-AXIS HIERARCHY
1. **Z-100 (System Loader)**: Critical boot/reboot states.
2. **Z-80 (Modal/Overlay)**: Scene Browser, Create Menu (Full-screen focus).
3. **Z-70 (Drawers)**: Hierarchy and Inspector (Side panels).
4. **Z-60 (Contextual HUD)**: Selection Toolbar (Mobile entity actions).
5. **Z-50 (Command Hub)**: Primary floating action island (Bottom center).
6. **Z-40 (Telemetry Pill)**: Status readout (Top center).
7. **Z-30 (Virtual Joypad)**: Input layer (Thumb zones only).
8. **Z-0 (Viewport)**: The simulation canvas.

## 2. PRIMARY REGIONS
- **The Floating North (Telemetry)**: 
  - `Top: 1.5rem`, `Left: 50%`, `Translate-X: -50%`.
- **The Command Anchor (Hub)**:
  - `Bottom: 2.5rem`, `Left: 50%`, `Translate-X: -50%`.
- **The Thumb Corridors (Joypads)**:
  - `Bottom: 0`, `Height: 60%`, `Width: 40%`.
  - Left Corridor: Movement.
  - Right Corridor: Aiming/Jump.

## 3. PADDING & GUTTERS
- **Global Inset**: `1.5rem` (24px).
- **Touch Target**: Minimum `3rem x 3rem` (48px) for all primary interaction buttons.