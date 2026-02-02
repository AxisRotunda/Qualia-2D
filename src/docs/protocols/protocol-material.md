# [T0] Material Protocol
ID: PROTOCOL_MATERIAL_V1.0 | Role: Visual Calibration.

## 1. INTENT
Govern the visual representation of entities on the Canvas2D plane.

## 2. RENDER STACK
1. **Background**: Engine `bgColor` + Grid.
2. **Layer 0**: Environment/Static geometry.
3. **Layer 1**: Dynamic entities.
4. **Layer 2**: Particle systems.
5. **Overlay**: Debug physics shapes + Selection wireframes.

## 3. PROPERTY RULES
- **Colors**: Must align with `tokens.md`.
- **Opacity**: Global alpha blending rules for entities.