# [T0] Refactor Protocol: Modular Evolution
ID: REFACTOR_PROTOCOL_V4.0 | Role: Architectural Purification, Portability & Boundary Enforcement.

## 1. INTENT
The `RUN_REF` command triggers a deep-scan of the codebase to eliminate structural decay, optimize for Agent continuity, and enforce **Modular Portability**. The goal is a project structure where core engine systems (Physics, ECS, Scene Management) function as self-contained, easily integrable modules with quantified isolation metrics.

### 1.1 SEVERITY & TARGET SCOPE
Refactors must be invoked with specific targets to manage token budget and complexity:

| Severity | Target Scope | Heuristic Set | Max Budget |
| :--- | :--- | :--- | :--- |
| **Light** | Local Module | Naming, Signal Purity, Inline Cleanup | <= 80 LOC / file |
| **Standard** | Domain (e.g., UI) | Monolith Splitting, Boundary Checks | ~150 LOC / file |
| **Deep** | Cross-Cutting | Architectural Re-wiring, Cycle Breaking | Unlimited |

**Target Scopes**: `ui` | `engine` | `data` | `services` | `cross-cutting`.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 MODULAR ISOLATION (PORTABILITY)
- **Principle**: Systems must be uncoupled.
- **Dependency Rule**: Modules must communicate via Signal-based interfaces. Avoid direct service-to-service cross-linking.

### 2.2 GRANULAR DATA DECOMPOSITION
- **Logic vs. Data**: Static data MUST live in `src/data/`.
- **Sub-Domain Roots**: 
  - `src/data/scenes/**` (Levels/Fragments).
  - `src/data/prefabs/**` (Blueprints).
  - `src/data/guides/**` (Human Translations).
- **Threshold**: Any object/array > 20 lines or used in >2 places must be relocated to a data root and re-exported via a barrel (`index.ts`).

### 2.3 INDUSTRY-STANDARD HIERARCHY
Refactors must move the project toward this unidirectional mapping:
`src/app/ui/**` -> `src/services/**` -> `src/engine/**` (Logic) & `src/data/**` (State/Resource).

### 2.4 ASYNC & SIGNAL BOUNDARY
- **Rule**: Any async source (fetch, WASM, event streams) in `src/services` MUST be normalized into signals before crossing into `src/engine` or `src/app/ui`.
- **Mandate**: Use `toSignal()` or `computed()` wrappers in services. Engine and UI must consume only signals or pure parameters. No Observables/Promises allowed inside `src/engine`.

### 2.5 ENGINE MODULE PORTABILITY SCORE (P)
For any module under `src/engine/*`, compute: `P = externalDepsCount + configSurfaceSize`.
- **Standard**: `P <= 3`.
- **Corrective Action**: If `P > 3`, extract configuration into `src/data/[domain]/config.ts` and introduce an `EngineBridge` interface in `src/services`.

### 2.6 REF-AWARE BOUNDARIES FOR UI
- **Rule**: UI components must never depend directly on `src/engine/**`.
- **Action**: Move direct engine imports into a façade in `src/services` (e.g., `engine-bridge.service.ts`).

## 3. LOGIC MATRIX: RUN_REF [TARGET]

| Target | Heuristic | Action |
| :--- | :--- | :--- |
| **BoundaryLeak** | Import from forbidden layer | Create façade in `src/services`, rewire imports. |
| **AsyncLeak** | Raw Promise/Observable in UI/Engine | Move origin to service, expose as `signal`. |
| **ConfigSpread** | > 2 config literals in Engine | Extract to `src/data/[domain]/config.ts`. |
| **RenderStateLeak** | Stateful fields in Renderer | Move state into `state-2d.service` (Signals/ECS). |
| **Monolith** | File > 250 lines (Engine/Service) | Split by responsibility (System vs Factory vs Adapter). |
| **UI Monolith** | File > 300 lines (UI) | Extract child components or directives. |
| **EngineCycle** | Engine depends on UI/Services | Move logic to pure engine core or orchestrator service. |

## 4. EXECUTION & LOGGING

### 4.1 PORTABILITY & BOUNDARY CHECKLIST
Every RUN_REF execution must verify:
- [ ] Engine Portability ok? (P <= 3)
- [ ] UI-Engine boundary ok? (No direct engine imports in UI)
- [ ] Async boundaries ok? (All async converted to signals)
- [ ] Unidirectional path ok? (UI -> Service -> Engine)

### 4.2 MEMORY LOG (src/docs/history/memory.md)
Entries must include:
- **Action**: Imperative summary (e.g., "Isolated physics engine from state-2d.service").
- **Context**: Files touched + Reason (Monolith, BoundaryLeak, etc.).
- **Outcome**: Pass/Fail + Portability Score (P) Delta.

## 5. SAFEGUARDS
- **Async Guard**: No direct `setTimeout`, `rAF`, or DOM events in `src/engine`. Only `runtime` or `services` may own these.
- **Design Guard**: Ensure container integrity and centralized design tokens (no inline magic colors).
- **Zoneless Integrity**: Absolute prohibition of `zone.js`.
