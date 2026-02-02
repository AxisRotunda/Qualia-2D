# [T0] Optimization Protocol
ID: PROTOCOL_OPTIMIZE_V1.0 | Role: Performance Calibration.

## 1. INTENT
Maximize simulation FPS and minimize Signal-based UI churn.

## 2. METRICS
- **Target FPS**: 60 (Locked).
- **Physics Time**: < 5ms per step.
- **Zoneless CD**: 0 triggers per second (purely reactive).

## 3. HEURISTICS
1. **WASM Boundary**: Ensure `Physics2DService` is only calling RAPIER functions inside the loop.
2. **Signal Efficiency**: Convert `effect()` calls to `computed()` where possible.
3. **Drawing Overhead**: Verify `Renderer2DService` is not redrawing static layers.

## 4. ACTION ITEMS
- Detect and flag high-frequency `Map` lookups in `ComponentStoreService`.
- Audit `GameLoopService` for GC pressure from temporary objects.