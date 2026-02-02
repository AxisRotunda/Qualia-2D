# [T1] Aesthetic & Design Guidelines
ID: VISUAL_CORE_V1.0 Role: Human Interface Excellence.

## 1. DESIGN PHILOSOPHY
Qualia2D is transitioning from a "Machine-Heavy" HUD to an "Immersive Toolset". The interface should feel like a premium creative instrument—inviting, responsive, and oriented toward human sensory consumption.

## 2. CORE PILLARS

### 2.1 TOUCH-FIRST ERGONOMICS
- **Target Size**: Minimum touch target of 44x44px.
- **Thumb Zone**: Critical controls (Play/Pause, Spawn) positioned in the lower-central region for easy mobile access.
- **Gestures**: Support for pinch-to-zoom and two-finger pan as primary navigation.

### 2.2 IMMERSIVE DEPTH
- **Glassmorphism**: Use `backdrop-blur` and low-opacity fills to allow the simulation to "bleed" through the UI.
- **Feedback**: Soft shadows (`shadow-xl`) and subtle scale transforms (`active:scale-95`) for tactile feedback.
- **Color Palette**: 
  - Neutral Base: Slate-950 (Background), Slate-900 (Panels).
  - High Performance: Amber-500 (Warnings/Active State).
  - Action Primary: Blue-600 (Creation/UI Selection).

### 2.3 TYPOGRAPHIC HIERARCHY
- **Human Readability**: Move away from all-caps "MATRIX" logs for primary interactions. Use clear, sans-serif weights for readability.
- **Engine Data**: Maintain Mono fonts (e.g., `font-mono`) exclusively for raw telemetry (FPS, ECS IDs) to preserve "Pro" feel.

## 3. UI EVOLUTION
- **The Dashboard**: Replace cluttered left-aligned stats with a clean, semi-transparent Top Bar or floating bubbles.
- **The Palette**: Use icon-driven buttons with descriptive tooltips rather than raw protocol names where possible.