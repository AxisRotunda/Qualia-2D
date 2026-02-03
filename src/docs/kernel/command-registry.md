# [T0] Command Registry

## 1. OPERATIONAL VERBS

| Command | Protocol | Intent | Documentation |
| :--- | :--- | :--- | :--- |
| `RUN_PROTOCOL` | protocol-constructor | Construct or iterate on engine protocols. | [Constructor](../protocols/protocol-constructor.md) |
| `RUN_INDUSTRY` | protocol-industry | Research and integrate industry standards. | [Industry](../protocols/protocol-industry.md) |
| `RUN_KNOWLEDGE` | protocol-knowledge | Sync documentation hierarchy. | [Knowledge](../protocols/protocol-knowledge.md) |
| `RUN_GUIDE_GEN` | protocol-guide-gen | Generate human-readable guides from technical docs. | [Guide Gen](../protocols/protocol-guide-gen.md) |
| `RUN_OPT` | protocol-optimize | Performance and GC tuning. | [Optimize](../protocols/protocol-optimize.md) |
| `RUN_REF` | protocol-refactor | Architectural cleanup & bottleneck hunt. | [Refactor](../protocols/refactor-protocol.md) |
| `RUN_REPAIR` | protocol-repair | Error recovery and stability. | [Repair](../protocols/protocol-repair.md) |
| `RUN_UI` | protocol-ui | View layer audit. | [UI](../protocols/protocol-ui.md) |
| `RUN_MEM_ARCH` | protocol-memory-arch | Optimize memory tiering and retrieval. | [Memory Arch](../protocols/protocol-memory-arch.md) |

## 2. DOMAIN SPECIFIC VERBS

| Command | Protocol | Intent | Documentation |
| :--- | :--- | :--- | :--- |
| `RUN_PHYS` | protocol-dynamics | Physics tuning and step adjustment. | [Dynamics](../protocols/protocol-dynamics.md) |
| `RUN_MAT` | protocol-material | Surface physics and blending. | [Material](../protocols/protocol-material.md) |
| `RUN_SPRITE` | protocol-sprite | Sprite rendering and atlas management. | [Sprite](../protocols/protocol-sprite.md) |
| `RUN_POST` | protocol-post-processing | Optical fidelity and screen-space filters. | [Post-Processing](../protocols/protocol-post-processing.md) |
| `RUN_ASSET` | protocol-asset-pipeline | Resource loading and cache management. | [Asset Pipeline](../protocols/protocol-asset-pipeline.md) |
| `RUN_SCENE_OPT` | protocol-scene-optimizer | Level-logic deletion of out-of-bounds entities. | [Scene Opt](../protocols/protocol-scene-optimizer.md) |

## 3. PROTOCOL EVOLUTION
Operational verbs are not static. Use `RUN_PROTOCOL` to mutate existing logic or create new domain-specific capabilities (e.g., `RUN_SCENE_GEN`).