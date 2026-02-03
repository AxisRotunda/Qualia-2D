# [T0] Archetype Protocol
ID: PROTOCOL_ARCHETYPE_V1.0 | Role: High-Volume Instantiation.

## 1. INTENT
To eliminate main-thread blocking ("jank") during the loading of high-density scenes (500+ entities). This protocol enforces **Time-Sliced Spawning** (Chunking) and **Archetype Pooling** patterns inspired by DOTS/ECS.

## 2. HARD STRUCTURAL DEFINITIONS

### 2.1 TIME-SLICED SPAWNING
- **Concept**: Break serial loops into batches.
- **Budget**: 12ms per frame (leaving 4ms for browser overhead).
- **Mechanism**: If `performance.now()` exceeds budget, await `requestAnimationFrame`.

### 2.2 ARCHETYPE POOLING
- **Concept**: Reuse component data structures where possible (Conceptually).
- **Implementation**: In the current Map-based ECS, we focus on **Batch Injection** to minimize map resize overhead.

## 3. LOGIC MATRIX: RUN_ARCHETYPE [SCENE_ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **STREAM** | Invoke `spawner.spawnStream()` with total count and factory function. |
| 02 | **SLICE** | Iterate through count. Check `frameBudget` every N entities. |
| 03 | **YIELD** | If over budget, `await new Promise(r => requestAnimationFrame(r))`. |
| 04 | **FINALIZE** | Resolve promise when all entities are spawned. |

## 4. SKELETAL GUIDELINES (SG)

```typescript
// Spawner2DService.spawnStream
async spawnStream(config: { count: number, factory: (i: number) => void }) {
  const start = performance.now();
  for (let i = 0; i < config.count; i++) {
    config.factory(i);
    if (i % 16 === 0 && (performance.now() - start) > 12) {
      await new Promise(r => requestAnimationFrame(r));
    }
  }
}
```

## 5. SAFEGUARDS
- **Async Guard**: Scene Loaders must be `async` and awaited by `SceneManager`.
- **Reference Integrity**: Ensure spawned entities are fully registered in ECS before the scene is marked as "Ready".
- **Zoneless**: Use native Promises and RAF; avoid Angular wrappers.