# [T0] Scene Optimizer Protocol
ID: PROTOCOL_SCENE_OPT_V1.0 | Role: Graph Pruning.

## 1. INTENT
Maintain a lean ECS graph by removing redundant or out-of-bounds entities.

## 2. OPTIMIZATION RULES
1. **OOB Culling**: Delete dynamic entities where `y < -50` (fell off world).
2. **Distance Culling**: Pause physics for entities > 100 units from camera (optional).
3. **Batching**: Identify opportunities for instanced-like drawing (if supported by canvas).

## 3. EXECUTION
Triggered via `RUN_SCENE_OPT` verb. Provides a report on "Nodes Pruned".