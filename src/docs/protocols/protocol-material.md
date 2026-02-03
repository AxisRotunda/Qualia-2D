# [T1] Material Protocol: Surface Physics
ID: PROTOCOL_MATERIAL_V2.0 | Role: Visual State Calibration.

## 1. INTENT
Govern the physical properties of entity surfaces on the XY plane. This protocol defines how light, opacity, and color interact within the "Obsidian Glass" environment.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 PROPERTY MAPPING
- **Primary Color**: Derived from `Sprite2D.color`. Must align with `tokens.md`.
- **Transparency**: Managed via `Sprite2D.opacity`.
- **Blending**: Standard Alpha Blending (default). Additive support for "Energy" layers.

### 2.2 MATERIAL STATES
1. **Glass (Passive)**: `opacity: 0.6`, `blur: active`. Used for background geometry.
2. **Solid (Occluder)**: `opacity: 1.0`. Used for dynamic physics entities.
3. **Plasma (Emitter)**: `opacity: 0.8`. Used for force fields and UI indicators.

## 3. LOGIC MATRIX: RUN_MAT [ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **CALIBRATE** | Ensure color hex codes pass 4.5:1 contrast checks against `bgColor`. |
| 02 | **STRATIFY** | Assign `Sprite2D.layer` based on entity category (0: Static, 1: Dynamic, 2: VFX). |
| 03 | **INJECT** | Update the `ComponentStoreService` with the new visual parameters. |

## 4. SKELETAL GUIDELINES (SG)
```typescript
// Applying a Plasma Material
this.ecs.sprites.update(id, s => ({
  ...s,
  color: '#6366f1',
  opacity: 0.8,
  layer: 2
}));
```

## 5. SAFEGUARDS
- **Contrast Guard**: No `#000` or `#fff` literals allowed; use `tokens.md` semantic names.
- **Opacity Guard**: `opacity` must remain within `[0.05, 1.0]` to prevent "Invisible Physics" glitches.
- **Zoneless Bound**: Material updates must be signal-driven; avoid direct Canvas context mutation outside the `RenderSystem`.