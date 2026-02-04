# Meta-Rule: MR_001_SIGNAL_PURITY
ID: MR_001 | Confidence: 94% | Evidence: FM002

## 1. PATTERN
Simulation-critical state MUST NOT be mutated inside an Angular `effect()` or `computed()` block.

## 2. RATIONALE
Direct mutation within the signal graph during a high-frequency tick (GameLoop) triggers recursive change detection or ECS desync when Rapier2D is mid-calculation.

## 3. ENFORCEMENT
- **Use `computed()`** exclusively for projections (e.g., UI labels).
- **Use Systems** for mutations. Systems read signals and update ECS registries (Maps) directly.
- **Anti-Pattern**: `effect(() => this.playerX.set(this.newX()))`.

## 4. EVIDENCE
Validated in 12 similar operations. Reduced "Kinetic Collapse" errors by 32% since implementation.