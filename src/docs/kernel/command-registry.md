# [T0] Command Registry

## 1. OPERATIONAL VERBS (V2.0 - Intelligence Metrics)

| Command | Confidence | Avg CoT Steps | Last Failure | Meta-Rule Coverage |
| :--- | :--- | :--- | :--- | :--- |
| `RUN_PROTOCOL` | 94% | 8.2 | None | 12 rules |
| `RUN_UI` | 89% | 5.1 | 2026-01-15 | 8 rules |
| `RUN_REPAIR` | 78% | 11.4 | 2026-02-01 | 5 rules |
| `RUN_PHYS` | 92% | 6.7 | None | 10 rules |
| `RUN_MEM_ARCH` | 95% | 7.4 | None | 6 rules |

## 2. DOMAIN SPECIFIC VERBS

| Command | Intent | Documentation |
| :--- | :--- | :--- |
| `RUN_PROJECT` | Project lifecycle & scenes. | [Project](../protocols/protocol-project.md) |
| `RUN_ENV` | Environmental rendering. | [Visual Core](../protocols/protocol-visual-core.md) |
| `RUN_ASSET` | Resource pipeline. | [Asset Pipeline](../protocols/protocol-asset-pipeline.md) |
| `RUN_RPG_SYS` | RPG Mechanics (Dialog/Portals). | [RPG](../protocols/protocol-rpg.md) |

## 3. META-RULE MAPPING
- **Low Confidence (< 80%)**: Triggers mandatory **Self-Consistency Voting**.
- **High Complexity (> 8 steps)**: Triggers mandatory **Step-Back Prompting [00]**.

## 4. STRUCTURAL_HASH
SIH: `QUALIA_REG_2.0_B3E91`