# [T0] Knowledge Protocol: Semantic Synthesis
ID: PROTOCOL_KNOWLEDGE_V2.0 | Role: Context Synchronization & Mapping.

## 1. INTENT
To ensure the Qualia2D documentation kernel remains a perfect, high-density reflection of the current code state. This protocol governs the discovery, categorization, and mapping of engine logic to prevent "contextual drift" and ensure Agent performance.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 MAPPING AUTHORITY
- **Primary Source**: `src/docs/core/project-hierarchy.md`.
- **Secondary Source**: `src/docs/kernel.md`.
- **Mandate**: Any execution of `RUN_KNOWLEDGE` that creates or moves a file MUST update both sources in the same transaction.

### 2.2 DIRECTORY GOVERNANCE
New documentation must be allocated to the following prioritized sub-folders:
- `src/docs/kernel/`: Core engine laws and axial directives.
- `src/docs/protocols/`: Operational verbs and system governance.
- `src/docs/engine/`: Deep architectural dives (ECS, Physics, Render).
- `src/docs/visual/`: HUD and Aesthetic specifications.
- `src/docs/history/`: Memory logs and repair traces.

### 2.3 DOCUMENTATION DENSITY
- **AI-First**: Use matrices, tables, and IDs over prose.
- **Cross-Linking**: Every new doc must link back to its parent kernel or relevant protocol.

## 3. LOGIC MATRIX: RUN_KNOWLEDGE [TARGET]

| Step | Action | Logic |
| :--- | :--- | :--- |
| 01 | **DISCOVER** | Scan `src/` for undocumented services, systems, or data structures. |
| 02 | **CATEGORIZE** | Determine if the discovery requires a **Protocol** (Action) or an **Architectural Dive** (State). |
| 03 | **SYNTHESIZE** | Generate the `.md` file using Obsidian Glass documentation standards. |
| 04 | **MAP** | Append the new file path to `project-hierarchy.md` and update `kernel.md` if necessary. |
| 05 | **CHRONICLE** | Update `src/docs/history/memory.md` with the "Knowledge Sync" event. |

## 4. INTELLIGENT IMPROVEMENTS (V2.0)
- **Orphan Detection**: Automatically flag files in the root `src/` that should be modularized.
- **Dependency Awareness**: New protocols must list the specific `src/services` or `src/engine` modules they govern.
- **Fragment Memory**: If a repair log is resolved, `RUN_KNOWLEDGE` should summarize its findings into the relevant core protocol to prevent regressions.

## 5. SAFEGUARDS
- **No Ghost Files**: Do not link to files that do not exist.
- **Zoneless Documentation**: Documentation must strictly reflect the zoneless, signal-driven nature of the app.
