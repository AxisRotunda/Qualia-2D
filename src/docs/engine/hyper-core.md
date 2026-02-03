# [T1] Hyper-Core: Predictive Latency & Logic
ID: ENGINE_HYPER_V1.0 | Role: Performance & Interaction Logic.

## 1. THE OBJECTIVE
Hyper-Core is the engine's "Pre-Cognition" layer. It ensures that user interaction and camera following feel instantaneous (0 perceived latency) by predicting trajectories before they are fully resolved by the simulation or hardware buffers.

## 2. KALMAN FUSION (PREDICTION)
Qualia2D utilizes a SIMD-mimic **Kalman Filter** for trajectory smoothing and prediction.
- **State Vector**: `[x, y, vx, vy]` (Position and Velocity).
- **Logic**:
  - **Predict Step**: Advances the state based on current velocity and delta time (`dt`).
  - **Correct Step**: Adjusts the prediction based on raw hardware measurements (Mouse/Touch coords).
- **Application**:
  - **Input**: The world-space cursor is a "Filtered" point, eliminating sensor noise and jitter.
  - **Camera**: Tracking uses the *predicted* future location of an entity, effectively neutralizing visual lag during high-speed motion.

## 3. GESTURE ORACLE (CLASSIFICATION)
Traditional input handling relies on complex `if/else` trees that are prone to edge-case failure. The **Gesture Oracle** replaces this with a deterministic **Finite State Acceptor (FSA)**.
- **Lookup Table (LUT)**: A 32KB pre-synthesized matrix.
- **Classification**: Input deltas are quantized into 5-bit indices. A single O(1) memory lookup returns the gesture (TAP, DRAG, FLICK, HOLD).
- **Performance**: Zero object allocation on the hot path.

## 4. SPATIAL FRACTAL SORTING
The `RenderSystem` utilizes **Z-Order Curves (Morton Codes)** to optimize draw-call spatial locality.
- **Method**: Interleaving bits of X and Y coordinates to generate a single 1D index.
- **Sorting**: Entities are sorted by `Layer` -> `MortonCode`.
- **Outcome**: Maximizes CPU cache hits for spatial queries and improves texture batching efficiency.

## 5. SAFEGUARDS
- **Zero-Allocation**: Hot paths in `Input2DService` and `RenderSystem` must avoid `new Object()` or `new Array()`.
- **TypedArrays**: Only `Float32Array` or `Uint32Array` are permitted for Hyper-Core math kernels.