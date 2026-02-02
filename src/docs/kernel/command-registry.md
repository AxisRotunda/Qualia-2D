# [T0] Command Registry

## 1. OPERATIONAL VERBS

| Command | Protocol | Intent | Documentation |
| :--- | :--- | :--- | :--- |
| `RUN_PROTOCOL` | protocol-constructor | Construct or iterate on engine protocols. | [Constructor](./protocol-constructor.md) |
| `RUN_KNOWLEDGE` | protocol-knowledge | Sync documentation hierarchy. | [Kernel Index](../kernel.md) |
| `RUN_OPT` | protocol-optimize | Performance and GC tuning. | - |
| `RUN_REF` | protocol-refactor | Architectural cleanup & bottleneck hunt. | [Refactor](./refactor-protocol.md) |
| `RUN_REPAIR` | protocol-repair | Error recovery and stability. | - |
| `RUN_UI` | protocol-ui | View layer audit. | [Aesthetic](../visual/aesthetic.md) |

## 2. DOMAIN SPECIFIC VERBS

| Command | Protocol | Intent |
| :--- | :--- | :--- |
| `RUN_PHYS` | protocol-dynamics | Physics tuning and step adjustment. |
| `RUN_MAT` | protocol-material | Sprite and render calibration. |
| `RUN_SCENE_OPT` | protocol-scene-optimizer | Level-logic deletion of out-of-bounds entities. |

## 3. PROTOCOL EVOLUTION
Operational verbs are not static. Use `RUN_PROTOCOL` to mutate existing logic or create new domain-specific capabilities (e.g., `RUN_SCENE_GEN`).