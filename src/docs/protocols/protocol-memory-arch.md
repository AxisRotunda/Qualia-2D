# [T0] Memory Architecture Protocol
ID: PROTOCOL_MEMORY_ARCH_V2.0 | Role: Cognitive Stratification.

## 1. INTENT
Harden the Qualia2D memory system into a tiered architecture that bridges runtime execution data (JS/WASM) with architectural intent (Markdown).

## 2. THE FOUR TIERS

| Tier | Name | Persistence | Logic |
| :--- | :--- | :--- | :--- |
| **T0** | Ephemeral | Volatile (Map) | High-speed LRU (128 entries) for immediate recall. |
| **T1** | Semantic | Session (Array) | Sliding window (100 entries) for trend analysis. |
| **T2** | Persistent | Local (IndexedDB) | Long-term audit trail of every engine command. |
| **T3** | Narrative | Project (memory.md) | **[NEW]** Synthesized history for Agent continuity. |

## 3. NARRATIVE SYNC (T2 -> T3)
The "Sync" is the process of an Agent synthesizing Tier 2 logs into the Tier 3 `memory.md` file.

### 3.1 SYNC TRIGGERS
- Execution of `RUN_REPAIR` (Immediate Sync).
- Execution of `RUN_MEM_ARCH` (Full Audit Sync).
- Major Architectural Mutations (vX.Y increment).

### 3.2 SYNTHESIS LOGIC
1. **Filter**: Identify "Structural Commands" (REF, REPAIR, PROTOCOL).
2. **Summarize**: Convert raw command strings into human-readable "Action/Context/Outcome" blocks.
3. **Persist**: Update `src/docs/history/memory.md`.

## 4. LOGIC MATRIX: RUN_MEM_ARCH [ACTION]

| Action | Logic |
| :--- | :--- |
| **INGEST** | Every `CommandRegistry.execute` MUST trigger `memory.ingest()`. |
| **SUMMARIZE** | Synthesize Tier 1 trends into a `SessionSummary` object. |
| **AUDIT** | Count T2 entries and compare against T3 chronicle for desync. |

## 5. SAFEGUARDS
- **Agent Authority**: The Agent is the ONLY entity allowed to write to T3 (`memory.md`).
- **Data Integrity**: T3 must never contain raw JSON; it is a narrative document.
- **Zoneless Bound**: Memory operations must never block the `RenderSystem`.