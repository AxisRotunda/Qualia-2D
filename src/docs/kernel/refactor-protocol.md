# [T0] Refactor Protocol
ID: REFACTOR_PROTOCOL_V2.0 | Role: Architectural Purification.

## 1. OBJECTIVES
The `RUN_REF` command triggers a deep-scan of the codebase to eliminate structural decay and optimize for Agent continuity.

## 2. TARGET HEURISTICS

### 2.1 MONOLITH DETECTION
- **Search**: Files exceeding 300 lines (excluding documentation).
- **Action**: Decompose into domain-specific services or utility functions.
- **Mapping**: Ensure all new files are registered in `project-hierarchy.md`.

### 2.2 BOTTLENECK & STALL IDENTIFICATION
- **Logic**: Seek out synchronous loops that could block the `GameLoopService`.
- **Physics**: Identify redundant state-sync calls between Rapier2D and ECS.
- **Signals**: Detect expensive `computed()` chains that trigger unnecessary UI re-renders.

### 2.3 DEPENDENCY PURITY
- **Circular Dependencies**: Scrutinize `ComponentStoreService` <-> `Physics2DService` cycles. 
- **Zoneless Safety**: Ensure NO `NgZone` or `zone.js` patterns have leaked into the runtime.

## 3. AGENT CONTINUITY & CONTEXT
- **Memory Recall**: Ensure every refactor updates relevant `src/docs/history/` logs.
- **Context Density**: Optimize file headers for AI ingestion (ID tags, clear export lists).
- **Naming Convention**: Enforce strict "Qualia2D" naming across all namespaces.

## 4. POST-DELETION AUDIT
Once code edits are complete, the protocol MUST:
1. Update `project-hierarchy.md` (Paths/Descriptions).
2. Update `memory.md` (Action/Context/Outcome).
3. Output a **Heuristics Report** summarizing:
   - `[STALLS_CLEARED]`: Count of loop optimizations.
   - `[MONOLITHS_SPLIT]`: List of decomposed files.
   - `[DOC_SYNC]`: Confirmation of metadata alignment.