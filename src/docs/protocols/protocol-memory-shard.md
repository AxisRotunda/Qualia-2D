# [T0] Memory Sharding Protocol
ID: PROTOCOL_MEMORY_SHARD_V1.0 | Role: Contextual Longevity.

## 1. INTENT
Prevent `memory.json` and `memory.md` from exceeding cognitive context windows by functionally sharding history into versioned archives.

## 2. HARD STRUCTURAL DEFINITIONS
- **Threshold**: `memory.json` > 50 entries OR `memory.md` > 300 lines.
- **Shard Naming**: `memory-v[N].json` / `memory-v[N].md`.
- **Active Buffer**: Always maintain the current version as `memory.json`.

## 3. LOGIC MATRIX: RUN_MEM_SHARD

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **AUDIT** | Measure current log length/size. |
| 02 | **ARCHIVE** | Move current `memory.json` to `memory-v[N].json`. |
| 03 | **SUMMARIZE**| Generate a "Shard Summary" in the new `memory.json` root. |
| 04 | **INDEX** | Update `memory.md` with links to the new shard. |
| 05 | **FLUSH** | Reset the active buffer for new session data. |

## 4. SAFEGUARDS
- **Context Preservation**: The summary MUST contain the Top-3 Proven Patterns and Top-3 Failure Manifolds from the archived shard.
- **Deterministic Continuity**: No history is deleted; only moved.