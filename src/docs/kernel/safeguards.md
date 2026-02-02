# [T0] Safeguards & Validation

## 1. CODE MUTATION GUARDS

| Guard | Requirement | Trigger |
| :--- | :--- | :--- |
| Mutation Guard | No contradiction vs Axial Directives | Every Edit |
| Deprecation Shield | Verify knowledge-graph.md before deletion | Refactor |
| Zoneless Integrity | Absolute prohibition of zone.js | All Logic |
| Signal-State Only | State must exist within Signals | All State |

## 2. WASM BOUNDARY SAFETY (RAPIER)

1. **Finite Guard**: Every numeric input reaching the physics solver must pass `Number.isFinite()`.
2. **Dimension Logic**: Collider dimensions MUST be `Math.floor()` integers where discrete units are required.