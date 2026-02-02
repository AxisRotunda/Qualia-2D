# [T0] Command Registry

## 1. OPERATIONAL VERBS

| Command | Protocol | Intent | Documentation |
| :--- | :--- | :--- | :--- |
| `RUN_PROTOCOL` | protocol-constructor | Construct or iterate on engine protocols. | [Constructor](../protocols/protocol-constructor.md) |
| `RUN_KNOWLEDGE` | protocol-knowledge | Sync documentation hierarchy. | [Knowledge](../protocols/protocol-knowledge.md) |
| `RUN_OPT` | protocol-optimize | Performance and GC tuning. | [Optimize](../protocols/protocol-optimize.md) |
| `RUN_REF` | protocol-refactor | Architectural cleanup & bottleneck hunt. | [Refactor](../protocols/refactor-protocol.md) |
| `RUN_REPAIR` | protocol-repair | Error recovery and stability. | [Repair](../protocols/protocol-repair.md) |
| `RUN_UI` | protocol-ui | View layer audit. | [UI](../protocols/protocol-ui.md) |

## 2. DOMAIN SPECIFIC VERBS

| Command | Protocol | Intent | Documentation |
| :--- | :--- | :--- | :--- |
| `RUN_PHYS` | protocol-dynamics | Physics tuning and step adjustment. | [Dynamics](../protocols/protocol-dynamics.md) |
| `RUN_MAT` | protocol-material | Sprite and render calibration. | [Material](../protocols/protocol-material.md) |
| `RUN_SCENE_OPT` | protocol-scene-optimizer | Level-logic deletion of out-of-bounds entities. | [Scene Opt](../protocols/protocol-scene-optimizer.md) |

## 3. PROTOCOL EVOLUTION
Operational verbs are not static. Use `RUN_PROTOCOL` to mutate existing logic or create new domain-specific capabilities (e.g., `RUN_SCENE_GEN`).