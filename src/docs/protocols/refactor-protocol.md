# [T0] Refactor Protocol: Modular Evolution
ID: REFACTOR_PROTOCOL_V3.0 | Role: Architectural Purification & Portability.

## 1. INTENT
The `RUN_REF` command triggers a deep-scan of the codebase to eliminate structural decay, optimize for Agent continuity, and enforce **Modular Portability**. The goal is a project structure where core engine systems (Physics, ECS, Scene Management) function as self-contained, easily integrable modules.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 MODULAR ISOLATION (PORTABILITY)
- **Principle**: Systems must be uncoupled. The Physics engine should not "know" about the UI; the Renderer should not "know" about the Network.
- **Dependency Rule**: Modules must communicate via Signal-based interfaces or the `ComponentStoreService`. Avoid direct service-to-service cross-linking (Circular dependencies are a fatal error).
- **Self-Containment**: A module (e.g., `src/engine/physics/`) should ideally be portable to a different Angular project by copying its directory and providing its required Signal state.

### 2.2 GRANULAR DATA DECOMPOSITION
- **Logic vs. Data**: Static data (levels, item stats, guide text) MUST live in `src/data/`. Logic (calculators, managers) MUST live in `src/services/` or `src/engine/`.
- **Monolith Splitting**: Large object literals or arrays in services must be extracted into specialized data files within `src/data/[domain]/index.ts`.
- **Registry Pattern**: Use Barrel exports (`index.ts`) in data folders to provide a single, clean entry point for systems.

### 2.3 INDUSTRY-STANDARD HIERARCHY
Refactors must move the project toward this mapping:
- `src/app/ui/`: View-layer only (HTML/CSS/UX logic).
- `src/engine/`: Pure simulation logic (ECS, Systems, Runtime).
- `src/data/`: Resources, Prefabs, and Scene definitions (The "Content").
- `src/services/`: Orchestrators that bridge Engine and UI.

## 3. LOGIC MATRIX: RUN_REF [TARGET]

| Target | Heuristic | Action |
| :--- | :--- | :--- |
| **Monolith** | File > 250 lines | Split into specialized sub-services or data files. |
| **Coupling** | Circular Imports | Decouple via Signal events or intermediate ECS components. |
| **Data** | Inline Arrays | Decompose into `src/data/` modules with registry providers. |
| **State** | Non-Signal State | Convert to Signals to ensure Zoneless reactivity. |

## 4. AGENT CONTINUITY & CONTEXT
- **Memory Log**: Every refactor MUST update `src/docs/history/memory.md` with "Action/Context/Outcome".
- **Hierarchy Sync**: Update `src/docs/core/project-hierarchy.md` to reflect new directory structures.
- **Portability Audit**: Briefly verify if a moved module requires more than 3 external dependencies to function.

## 5. SAFEGUARDS
- **Zoneless Guard**: Never introduce `NgZone` or `zone.js` during refactoring.
- **Container Guard**: Ensure HTML tag integrity during UI decomposition.
- **Refactor Loop**: If a refactor breaks a protocol, `RUN_REPAIR` must be triggered immediately.