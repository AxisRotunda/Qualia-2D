# [T0] Memory Architecture Protocol
ID: PROTOCOL_MEMORY_ARCH_V3.0 | Version: 3.0 | Role: Cognitive Stratification & Retrieval.

## 1. INTENT
Harden the Qualia2D memory system into a tiered architecture that bridges runtime execution data with architectural intent. v3.0 introduces **Semantic Retrieval** and **Causal Tracing** to ensure the Agent learns from historical failures.

## 2. THE FOUR TIERS [V3.0]

| Tier | Name | Store | persistence | Logic |
| :--- | :--- | :--- | :--- | :--- |
| **T0** | Ephemeral | Map (LRU) | Volatile | High-speed recall for telemetry. |
| **T1** | Semantic | Array/Signals | Session | Trend analysis and cognitive load. |
| **T2** | Persistent | IndexedDB | Local | Hardware-surviving audit trail. |
| **T3** | Narrative | **memory.json** | Project | **[NEW]** Machine-readable causal logs. |
| **T4** | Index | **memory.md** | Project | Human-readable index + Manifolds. |

## 3. SEMANTIC RETRIEVAL PIPELINE (RAG)
Before every `RUN_PROTOCOL` or `RUN_REPAIR`:
1. **QUERY**: Embed current request and search `memory.json` for Top-5 similar ops.
2. **EXTRACT**: Retrieve confidence scores, performance deltas, and failure manifolds.
3. **INJECT**: Prepend findings to the Reasoning Chain to adjust the current Hypothesis.

## 4. FAILURE MANIFOLD TRACING
- **Mandate**: Every failure MUST be categorized as a Manifold in `memory.md`.
- **Structure**: Trigger -> Causal Chain -> Detection -> Validated Fix -> Confidence.

## 5. LOGIC MATRIX: RUN_MEM_ARCH [ACTION]

| Action | Logic |
| :--- | :--- |
| **INIT** | Bootstrap `memory.json` with existing `memory.md` records. |
| **SYNC** | Consolidate T1 session logs into T3/T4 Narrative. |
| **THEORIZE** | Promote operations with > 90% accuracy to `docs/meta-rules/`. |

## 6. STRUCTURAL_HASH
SIH: `QUALIA_MEM_3.0_C2B91`