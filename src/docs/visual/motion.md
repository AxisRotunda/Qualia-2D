# [T1] Motion & Interaction
ID: VISUAL_MOTION_V1.0 | Role: Physics of the UI.

## 1. TRANSITION PRIMITIVES
- **Standard Entrance**: `duration-500`, `ease-[cubic-bezier(0.2, 0, 0, 1)]`.
- **Fast Feedback**: `duration-200`, `ease-out`.
- **Simulation Shift**: `duration-700`, `ease-in-out` (used for canvas opacity shifts).

## 2. INTERACTION STATES
- **Press (Tactile)**: `active:scale-90`. Every button MUST provide scale feedback.
- **Hover (Focus)**: `hover:bg-white/5` + transition. 
- **Selection**: Smooth color interpolation from `Slate-400` to `White`.

## 3. GESTURE MAPPING
- **Single Touch**: Target selection or dragging.
- **Pinch**: Uniform camera zoom.
- **Long Press**: (Reserved for context-menu invocation).
- **Double Tap**: Camera Reset to Origin.
