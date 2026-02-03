# [T0] Memory Architecture Protocol
ID: PROTOCOL_MEMORY_ARCH_V1.0 | Role: Cognitive Stratification.

## 1. INTENT
Harden the Qualia2D memory system into a tiered, embedding-augmented architecture prioritizing O(1) retrieval, sub-quadratic storage growth, and relevance-driven access.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 TIERED HIERARCHY
1. **Tier 0 (Ephemeral)**: 
   - **Structure**: LRU Cache (Capacity: 128 entries).
   - **TTL**: 10 Ticks.
   - **Eviction**: Least Recently Used + Recency Score < 0.1.
2. **Tier 1 (Semantic Short-term)**:
   - **Structure**: Inverted Index + TF-IDF for keyword operations.
   - **TTL**: 1 Session.
   - **Size Limit**: ≤1kB JSON Stream.
3. **Tier 2 (Long-Term Vector Store)**:
   - **Structure**: MiniLM (384-dim) embeddings via ONNX in WASM.
   - **Retrieval**: ANN (HNSW, ef=128, M=32) for top-k=5.
   - **Pruning**: Cosine Similarity < 0.7 -> Merge/Summarize.

### 2.2 COMPACTION CRON
- **Frequency**: Every 100 Ticks.
- **Algorithm**: Hierarchical clustering (single-linkage, ε=0.5) to fuse redundant logs.
- **Goal**: Reduce redundancy by ≥40% asymptotically.

## 3. LOGIC MATRIX: RUN_MEM_ARCH [ACTION]

| Action | Logic |
| :--- | :--- |
| **INIT** | Initialize IndexedDB wrapper and check WASM availability for Vector Store. |
| **AUDIT** | Calculate and log Hit-Rate (>95% target) and Bloat-Ratio (<1.2 target). |
| **COMPACT** | Trigger forced hierarchical clustering on Tier 1 & 2. |
| **QUERY** | Execute Hybrid Retrieval (Vector + Keyword) for debug/agent context. |

## 4. RETRIEVAL ALGORITHM (HYBRID)
```typescript
function queryMemory(q: string, k: int): LogEntry[] {
  // 1. Embed Query (O(1))
  const e_q = embed(q); 
  // 2. ANN Search Tier 2 (O(log n))
  const candidates = annSearch(e_q); 
  // 3. Rerank Tier 0+1 (O(k))
  const reranked = crossEncode(candidates);
  // 4. Fusion
  return fuse(reranked, alpha * recency + beta * sim);
}
```

## 5. INTEGRATION DIRECTIVES
- **Zoneless Hooks**: Expose memory state via Angular Signals; emit on mutate (zero-overhead).
- **Storage**: Primary = IndexedDB (Applet-compliant); Fallback = ECS Registry.
- **Fallback**: If Embeddings/WASM unavailable, degrade to Stratified Sampling.
- **Latency Budget**: <50ms for n=10k entries on WASM thread.

## 6. SAFEGUARDS
- **Memory Leak**: Tier 0 must strictly enforce LRU capacity (128).
- **Thread Block**: Heavy compaction ops must yield to main thread or run in Web Worker.