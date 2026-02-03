# [T1] Memory Tiering: Cognitive Stratification
ID: ENGINE_MEMORY_V1.0 | Role: Session Persistence & Continuity.

## 1. THE HIERARCHY
Qualia2D implements a multi-tiered memory architecture designed to bridge the gap between high-frequency execution data and long-term architectural intent.

### [T0] EPHEMERAL (RECALL)
- **Store**: `Map<string, LogEntry>`.
- **Latency**: O(1).
- **Capacity**: 128 entries (LRU).
- **Purpose**: Immediate retrieval of recent commands for UI telemetry and quick-undo context.

### [T1] SEMANTIC (TRENDS)
- **Store**: Signal-wrapped Array.
- **Latency**: O(N).
- **Capacity**: 100 entries (Sliding Window).
- **Purpose**: Driving the "Cognitive Load" HUD and providing data for session trend analysis.

### [T2] PERSISTENT (CHRONICLE)
- **Store**: **IndexedDB**.
- **Latency**: Asynchronous (Disk).
- **Capacity**: Unbounded (System-limited).
- **Purpose**: Historical audit trail. Persists across browser refreshes.

### [T3] NARRATIVE (AGENT SYNC)
- **Store**: `src/docs/history/memory.md`.
- **Latency**: Manual/Agent-driven.
- **Purpose**: The "High-Level Memory." Synthesizes T2 logs into a narrative summary for future Agent context loading.

## 2. OPERATION: RUN_MEM_ARCH
This command triggers a "Memory Audit":
1. **Sync**: Flushes any pending T1 logs to T2 (IndexedDB).
2. **Analysis**: Computes command frequency and notable event logs.
3. **Synthesis**: Prepares the summary for the Agent to append to T3 (`memory.md`).

## 3. INTEGRATION: COMMAND REGISTRY
Every command executed via `CommandRegistryService` is automatically ingested into the memory system. This ensures that the engine's "Self-Awareness" is always a perfect reflection of its operational history.

## 4. SAFEGUARDS
- **Async Boundary**: T2 (IndexedDB) operations must never block the `RenderSystem`.
- **Privacy**: No PII or sensitive hardware tokens are stored in the persistent tiers.