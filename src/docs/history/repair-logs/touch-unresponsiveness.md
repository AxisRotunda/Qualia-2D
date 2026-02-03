# Repair Log: Touch Unresponsiveness [R1]
ID: REPAIR_TOUCH_V1.0 | Status: Resolved

## 1. SYMPTOM
Users report "Unresponsive Touch" on mobile devices, specifically when attempting to interact with HUD overlays (Scene Browser, Create Menu) or when switching between Virtual Joypad and Viewport interaction.

## 2. INVESTIGATION
- **Hypothesis A (Event Bubbling)**: Touch events on overlay buttons are bubbling through to the Viewport canvas, triggering camera pan logic simultaneously.
- **Hypothesis B (Passive Listeners)**: Mobile browsers (Safari/Chrome) treat touch events as `passive` by default, preventing `e.preventDefault()` from stopping browser-level scrolling/zooming.
- **Hypothesis C (Z-Index Conflict)**: Overlays and Joypad zones are competing for pointer focus in the same spatial layer.

## 3. APPLIED FIXES (v1.12)
1. **Input Barrier**: Added explicit `pointer-events-none` to the Viewport and Joypad layers when `isOverlayOpen` is true.
2. **Event Sink**: Implemented `stopPropagation()` on all overlay interaction containers to ensure they are the final destination for touch events.
3. **Passive Hardening**: Moved `ViewportComponent` touch listeners to a more defensive stance, ensuring they early-exit and do not interfere with UI layers.
4. **Input Reset**: Enforced `input.reset()` on every state change that toggles a full-screen overlay.

## 4. VERIFICATION
- Test: Open Scene Browser while holding Joypad. Result: Joypad resets, background freezes, UI remains responsive.
- Test: Rapidly tap "Create" then "Spawn". Result: Entity spawns at camera origin, menu closes cleanly.