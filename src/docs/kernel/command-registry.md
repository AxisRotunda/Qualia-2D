# [T0] Command Registry

## 1. OPERATIONAL VERBS

| Command | Protocol | Intent |
| :--- | :--- | :--- |
| `RUN_KNOWLEDGE` | protocol-knowledge | Sync documentation hierarchy. |
| `RUN_OPT` | protocol-optimize | Performance and GC tuning. |
| `RUN_REF` | protocol-refactor | Architectural cleanup. |
| `RUN_REPAIR` | protocol-repair | Error recovery and stability. |
| `RUN_UI` | protocol-ui | View layer audit. |

## 2. DOMAIN SPECIFIC VERBS

| Command | Protocol | Intent |
| :--- | :--- | :--- |
| `RUN_PHYS` | protocol-dynamics | Physics tuning and step adjustment. |
| `RUN_MAT` | protocol-material | Sprite and render calibration. |
| `RUN_SCENE_OPT` | protocol-scene-optimizer | Level-logic deletion of out-of-bounds entities. |