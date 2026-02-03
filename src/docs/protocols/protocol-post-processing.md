# [T1] Post-Processing Protocol: Optical Fidelity
ID: PROTOCOL_POST_V1.0 | Role: Final Pass Calibration.

## 1. INTENT
Apply screen-space filters and optical effects to the rendered scene to achieve the "Obsidian Glass" aesthetic.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 THE OBSIDIAN STACK
1. **Base Pass**: Raw Canvas2D output.
2. **Atmosphere**: Subtle `linear-gradient` overlays for depth.
3. **Filter Pass**: `backdrop-filter` and `filter` applied to the viewport container via CSS.

### 2.2 SUPPORTED EFFECTS
- **Chromatic Aberration**: 2px shift on mobile HUD elements.
- **CRT Grain**: 5% opacity noise overlay for "Analog Simulation" feel.
- **Bloom**: Canvas-based shadow/glow for "Emitter" layer sprites.

## 3. LOGIC MATRIX: RUN_POST [TARGET]

| Target | Effect | Implementation |
| :--- | :--- | :--- |
| **simulation** | Contrast/Brightness | CSS `filter` on the `#mainCanvas`. |
| **hud** | Blur/Glass | CSS `backdrop-filter` on UI drawers. |
| **emitters** | Glow/Pulse | `shadowBlur` in `RenderSystem` for Layer 2 entities. |

## 4. SKELETAL GUIDELINES (SG)
```css
/* Obsidian Glass Post-Process */
.viewport-glass {
  filter: contrast(1.1) saturate(1.2);
  backdrop-filter: blur(24px) saturate(180%);
}
```

## 5. SAFEGUARDS
- **Perf Guard**: Limit `backdrop-filter` usage to fixed UI containers. Avoid full-screen animation of blurs.
- **Readability**: Ensure post-processing does not drop contrast below 4.5:1.