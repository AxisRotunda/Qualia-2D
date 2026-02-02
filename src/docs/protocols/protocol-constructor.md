# [T0] Protocol Constructor
ID: PROTOCOL_CONSTRUCTOR_V2.1 | Role: Meta-Genesis Framework.

## 1. INTENT
This protocol governs the genesis, iteration, and structural integrity of all Qualia2D operational verbs. It ensures that every new command is deterministic, documented, and adheres to the engine's axial foundations via **Hard Structural Definitions (HSD)** and **Skeletal Guidelines (SG)**.

## 2. HARD STRUCTURAL DEFINITIONS (THE SCHEMA)
Every protocol file MUST contain the following mandatory sections to be considered valid. Omission of any section constitutes a protocol failure.

### [H0] IDENTITY
- **Header**: `# [Tn] Protocol Name`
- **Metadata**: `ID: [UNIQUE_ID] | Version: [X.Y] | Role: [PURPOSE]`

### [H1] CONTEXTUAL ANCHOR
- Clear mapping to the `src/` directory and existing services.
- Dependency list (e.g., `Requires: ComponentStoreService, Physics2DService`).
- **Source of Truth**: Links to related kernel or visual docs.

### [H2] HARD STRUCTURAL DEFINITIONS (HSD)
- **Invariants**: Rules that cannot be broken (e.g., "Must use Signals", "Must use Tailwind").
- **Classes/Constants**: Specific string literals or config values that must be used.
- **Target Definitions**: If the protocol targets specific sub-systems (like `RUN_UI`), define the targets here.

### [H3] LOGIC MATRIX
- A concrete mapping of **INPUT** (Verb Params) -> **PROCESS** (Step-by-step logic) -> **OUTPUT** (State/File changes).
- Must include a table of operations for complex verbs.
- **Heuristics**: If the protocol involves optimization, define the search criteria.

### [H4] SKELETAL GUIDELINES (SG)
- **Code Templates**: Reusable, copy-paste ready HTML/TS snippets.
- **Implementation Patterns**: "Hard" rules for implementation (e.g., specific tailwind class combinations).
- **Boilerplate**: Standardized error handling or logging structures.

### [H5] SAFEGUARDS
- Specific prohibitions (e.g., "No NaN leaks", "Zoneless integrity", "WASM boundary").
- **Recovery**: Diagnostic steps for when the protocol fails.

## 3. GENESIS & ITERATION LOGIC

### BRANCH A: GENESIS (New Protocol)
1. **Verify Uniqueness**: Check `command-registry.md` to prevent verb collisions.
2. **Path Allocation**: Determine if the protocol lives in `protocols/` (General) or a sub-domain.
3. **Skeleton Injection**: Generate the MD file using the schema in Section 2, ensuring **HSD** and **SG** are populated.
4. **Verb Registration**: Update `CommandRegistryService.ts` and `command-registry.md`.
5. **Hierarchy Sync**: Update `project-hierarchy.md`.

### BRANCH B: ITERATION (Existing Protocol)
1. **Bottleneck Analysis**: Check `memory.md` for previous stalls related to the protocol.
2. **Schema Audit**: Ensure the existing file meets the V2.1 Hard Structural Definitions.
3. **Logic Refinement**: Update the Logic Matrix for better efficiency/determinism.
4. **Version Increment**: Update the metadata header.
5. **Memory Log**: Update `src/docs/history/memory.md` with the "Action/Context/Outcome".

## 4. DESIGN PRINCIPLES
- **Irreducibility**: Protocols should target the smallest possible domain (e.g., `RUN_PHYS` vs `RUN_SIMULATION`).
- **AI-Density**: Documentation must be optimized for Agent ingestion (High-density mapping, no fluff).
- **Determinism**: The same input parameters must always result in the same structural output.
- **Self-Enforcement**: The protocol document itself must contain the rules to enforce its own correct usage.