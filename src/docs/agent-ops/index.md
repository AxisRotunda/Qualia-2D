# [T0] Agent Operations Index
ID: AGENT_OPS_ROOT_V1.0 | Role: External Intelligence Interface.

## 1. INTENT
This directory contains **Context Packs**: high-density instruction sets designed for external AI agents who do not have access to the full Qualia2D codebase. These documents provide the specific file paths, code skeletons, and registration steps required to perform atomic operations without hallucinating architecture.

## 2. OPERATION REGISTRY

| Task ID | Operation | Description | Link |
| :--- | :--- | :--- | :--- |
| **OP_01** | `ADD_SCENE` | Create a new playable level/fragment. | [Task: New Scene](./task-new-scene.md) |
| **OP_02** | `ADD_ENTITY` | Create a new prefab/blueprint. | [Task: New Entity](./task-new-entity.md) |
| **OP_03** | `ADD_GUIDE` | Create a documentation card for the UI. | [Task: New Guide](./task-new-guide.md) |
| **OP_04** | `MOD_UI` | Modify the Obsidian Glass interface. | [Task: UI Mod](./task-ui-mod.md) |

## 3. USAGE PROTOCOL
If you are an external agent:
1. Identify the task you are asked to perform.
2. Load the corresponding `task-[name].md` file.
3. **STRICTLY** adhere to the "Target Files" list. Do not modify files outside this list unless explicitly instructed.
4. Use the provided **Code Skeletons** to ensure compatibility with the Zoneless/Signal architecture.