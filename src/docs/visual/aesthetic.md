# [T1] Visual Identity: Obsidian Glass
ID: VISUAL_ROOT_V2.0 | Role: Experience Index.

## 1. CORE CONCEPT
Qualia2D utilizes the **Obsidian Glass** interface system. It is designed to feel like a high-performance aerospace HUD—transparent, data-dense, and ergonomically optimized for high-speed creative workflows.

## 2. SYSTEM ARCHITECTURE
The visual system is decomposed into specialized domains to ensure consistency across the engine lifecycle:

- **[Design Tokens](./tokens.md)**: The irreducible atoms (Colors, Blur, Space).
- **[HUD Architecture](./hud-architecture.md)**: The spatial layout and Z-indexing of instruments.
- **[Motion & Interaction](./motion.md)**: The physics of the UI (Transitions, Feedback).
- **[Component Blueprints](./blueprints.md)**: Skeleton structures for new UI modules.

## 3. INVARIANTS
1. **Simulation First**: The canvas must never be fully obscured by static UI.
2. **Blur is Depth**: Transparency must always be accompanied by background-blur to maintain readability.
3. **Contrast for Action**: Interactive elements must maintain 4.5:1 contrast against their glass backgrounds.
