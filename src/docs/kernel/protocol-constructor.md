# [T0] Protocol Constructor
ID: PROTOCOL_CONSTRUCTOR_V1.0 | Role: Meta-Genesis.

## 1. INTENT
This protocol governs the creation (`GENESIS`) and optimization (`ITERATION`) of Qualia2D operational verbs. It ensures that every new command adheres to Axial Directives and maps correctly to the project hierarchy.

## 2. STRUCTURAL SKELETON
When creating a new protocol (e.g., `RUN_NEW_PROTOCOL`), the constructor must define:

1. **Header**: ID, Version, and Role.
2. **Context**: Which part of the `src/` directory it interacts with.
3. **Logic Matrix**: 
   - `INPUT`: Natural language parameters.
   - `PROCESS`: Concrete code mutation rules.
   - `OUTPUT`: Desired state change in the engine/docs.
4. **Validation**: Safety checks (Zoneless integrity, WASM boundary).

## 3. LOGIC BRANCHES

### BRANCH A: GENESIS (New Protocol)
- **Trigger**: Command not found in `CommandRegistryService`.
- **Action**: 
  - Register Verb in `command-registry.md`.
  - Create dedicated `.md` documentation.
  - Inject logic handler into `CommandRegistryService.ts`.
  - Update `project-hierarchy.md` if new folders are created.

### BRANCH B: ITERATION (Existing Protocol)
- **Trigger**: Command already exists.
- **Action**:
  - Analyze existing `.md` for bottlenecks.
  - Refine Logic Matrix for efficiency.
  - Update versioning in the document header.
  - Log iteration in `src/docs/history/memory.md`.

## 4. DESIGN PRINCIPLES
- **Granularity**: Protocols should do ONE thing (e.g., `RUN_SCENE_GEN` vs `RUN_SCENE_OPT`).
- **AI-Readiness**: Use high-density mapping and machine-readable steps.
- **Determinism**: Protocols must result in predictable file-system mutations.