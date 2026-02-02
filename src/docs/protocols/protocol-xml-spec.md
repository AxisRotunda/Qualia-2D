# [T0] XML Mutation Specification
ID: PROTOCOL_XML_SPEC_V1.0 | Role: Structural Integrity Guard.

## 1. SCHEMA DEFINITION
The Agent MUST output all codebase updates within a single, valid XML block:
```xml
<changes>
  <change>
    <file>[full_path]</file>
    <description>[summary]</description>
    <content><![CDATA[Full file content]]]]><![CDATA[></content>
  </change>
</changes>
```

## 2. NON-NEGOTIABLE HTML RULES (ANGULAR V20)
Violation of these rules causes a fatal application crash.

### 2.1 CONTAINER INTEGRITY
An opening tag `<tag>` and its closing `</tag>` MUST be siblings in the same block.
- **INVALID**: `@if(c) { <div> } @else { </div> }` -> **FATAL ERROR**.
- **VALID**: `<div> @if(c) { ... } </div>` OR `@if(c) { <div>...</div> }`.

### 2.2 FORBIDDEN EXPRESSIONS
- **No Regular Expressions**: `[class.valid]="/regex/.test(val)"` -> **FATAL ERROR**.
- **No `new` Keywords**: `[value]="new Date()"` -> **FATAL ERROR**.
- **No Arrow Functions**: `(click)="() => handle()"` -> **FATAL ERROR**.

## 3. MUTATION HEURISTICS
1. **Minimalism**: Keep updates as minimal as possible while satisfying the request.
2. **Formatting**: Always provide full file content. Never use comments like `// ... rest of code`.
3. **Zoneless Safety**: Ensure `provideZonelessChangeDetection()` remains the only CD provider in `index.tsx`.

## 4. PERMISSIONS
If camera or microphone access is required, update `metadata.json`:
```json
{ "requestFramePermissions": ["camera", "microphone"] }
```]]></content>
  </change>

  <change>
    <file>src/docs/core/project-hierarchy.md</file>
    <description>Update hierarchy to include system instructions and XML spec.</description>
    <content><![CDATA[# Project Hierarchy: Qualia2D Hard Mapping

## / (Root)
- `index.tsx`: Application Bootstrapper (Zoneless).
- `index.html`: Main entry point, Tailwind & Import Maps.
- `metadata.json`: Engine metadata and permissions.

## /src
- `app.component.ts`: Root UI Component & Interaction Logic.
- `app.component.html`: View Layer (Human-Centric HUD).

### /src/engine
- `ecs/`:
  - `entity.ts`: ID generation logic.
  - `components.ts`: Component interfaces (Transform, Sprite, Physics).
  - `component-store.service.ts`: Central Signal-based ECS store.
- `runtime/`:
  - `game-loop.service.ts`: RAF-based loop (Outside Angular Zone).
- `scene.types.ts`: Scene definition interfaces.

### /src/services
- `engine-2d.service.ts`: Main engine orchestrator.
- `engine-state-2d.service.ts`: Global Signal-based state.
- `physics-2d.service.ts`: Rapier2D WASM wrapper.
- `renderer-2d.service.ts`: Canvas2D rendering system.
- `command-registry.service.ts`: T0 Verb execution logic.

### /src/docs
- `kernel.md`: High-level manifest & section index.
- `system-instructions.md`: [NEW] Agent System Instruction Manifest.
- **kernel/**:
  - `axial-directives.md`: Core principles (Applet Priority).
  - `safeguards.md`: Prohibitions (No GenAI) and Safety.
  - `command-registry.md`: Operational verb definitions.
- **protocols/**:
  - `protocol-constructor.md`: Protocol Genesis/Iteration logic.
  - `protocol-xml-spec.md`: [NEW] XML Schema and HTML integrity rules.
  - `protocol-knowledge.md`: Knowledge & Context sync logic.
  - `protocol-optimize.md`: Performance and WASM tuning.
  - `protocol-repair.md`: Stability and error recovery.
  - `protocol-ui.md`: UX/Design language enforcement.
  - `protocol-dynamics.md`: Physics simulation calibration.
  - `protocol-material.md`: Visual and rendering rules.
  - `protocol-scene-optimizer.md`: ECS pruning logic.
  - `refactor-protocol.md`: Refactoring heuristics.
- **visual/**:
  - `aesthetic.md`: Human-centric design guidelines (Root).
  - `tokens.md`: Atoms of design (Colors, Blur).
  - `hud-architecture.md`: Spatial layout rules.
  - `motion.md`: UI physics and interaction rules.
  - `blueprints.md`: Skeleton components for expansion.
- **history/**:
  - `memory.md`: Narrative log of development.]]></content>
  </change>

  <change>
    <file>src/docs/history/memory.md</file>
    <description>Log the creation of the system-instructions and xml-spec.</description>
    <content><![CDATA[# Memory Log

## [Init] Qualia2D Genesis
- **Action**: Initial system synthesis.
- **Outcome**: Established Zoneless shell, Rapier2D integration, and Signal-driven HUD.

## [v1.1] Manipulation & Debug Update
- **Action**: Enhanced interactivity and developer tooling.
- **Outcome**: Added Entity Dragging, Physics Debug Mode, and expanded Inspector.

## [v1.2] Protocol Meta-Layer & Refactor Logic
- **Action**: Deployment of Protocol Constructor and Refactor Heuristics.
- **Outcome**: Established meta-verbs for autonomous logic iteration.

## [v1.3] Protocol-Centric Restructure
- **Action**: Migrated refactor and constructor logic to `/protocols/` and generated missing domain protocols.
- **Context**: Centralizing operational logic for better Agent-Process mapping.
- **Outcome**: 
  - Created 9 dedicated protocol MD files.
  - Updated `command-registry.md` and `project-hierarchy.md`.
  - Established clear intent-to-file mapping for all engine verbs.

## [v1.4] Hard Deletion of Duplicates
- **Action**: Removed residual stub files in `src/docs/kernel/`.
- **Context**: Ensuring zero-redundancy in the protocol graph and absolute structural integrity.
- **Outcome**: Deleted `protocol-constructor.md` and `refactor-protocol.md` from the kernel directory. All internal engine references successfully redirected to the versioned protocols in `/src/docs/protocols/`.

## [v1.5] Meta-Logic Synthesis
- **Action**: Created `system-instructions.md` and `protocol-xml-spec.md`.
- **Context**: Defining the Agent's internal operating parameters for session coherence and codebase mutation safety.
- **Outcome**: 
  - Established the System Instruction manifest for Google AI Studio.
  - Documented the non-negotiable XML mutation and Angular HTML rules.
  - Updated Hierarchy and Knowledge graph.]]></content>
  </change>
</changes>
```