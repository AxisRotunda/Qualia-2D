# [T1] UI Protocol
ID: PROTOCOL_UI_V3.2 | Role: Aesthetic & Interface Synthesis.

## 1. INTENT
This protocol governs the synthesis, audit, and iteration of the Qualia2D view layer. It enforces the **Obsidian Glass** design language, emphasizing fluid hub layouts over rigid administrative sidebars.

## 2. CONTEXTUAL ANCHORS
- **Core Aesthetic**: [aesthetic.md](../visual/aesthetic.md)
- **Design Tokens**: [tokens.md](../visual/tokens.md)
- **Spatial HUD**: [hud-architecture.md](../visual/hud-architecture.md)

## 3. HARD STRUCTURAL DEFINITIONS (HSD)

### 3.1 THE FLUID HUB (NEW)
Used for the primary navigation and landing states.
- **Nav Anchor**: Floating top-center pill. `fixed top-12 left-1/2 -translate-x-1/2`.
- **Layout**: Centered flex/grid containers with `max-w-7xl` to prevent extreme horizontal stretching.
- **Surface**: `bg-slate-950/40 backdrop-blur-3xl border border-white/5`.

### 3.2 VIEWPORT ESCAPEMENT (Immersive States)
- **Rule**: Detailed content (Guides, Inspector) must overlay the screen using `fixed inset-0 z-[100]` on mobile, while maintaining high-density alignment on desktop.
- **Redundancy Guard**: Action buttons must only appear at final decision points (e.g., Scene Selection), never inside informational detail panels.

## 4. LOGIC MATRIX: RUN_UI [TARGET]

### TARGET: `main_menu`
- **Audit Checklist**:
  1. Verify removal of vertical sidebar.
  2. Check for floating navigation bar at the screen's top.
  3. Ensure background gradients provide depth without obscuring text.

### TARGET: `human_translations`
- **Audit Checklist**:
  1. Grid of modules for selection.
  2. No "Initialize" buttons in guide steps.
  3. Detail view uses immersive escapement.

## 5. SAFEGUARDS
- **Obscuration Limit**: Viewport must remain >40% visible during HUD operations.
- **Input Sanitization**: No Regex in templates.
- **Zoneless Integrity**: No `zone.js`.