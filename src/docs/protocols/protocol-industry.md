# [T0] Industry Protocol
ID: PROTOCOL_INDUSTRY_V1.1 | Role: Standards & Modernization.

## 1. INTENT
To research, analyze, and integrate leading-edge industry standards from established 2D engines (Godot, Unity, PixiJS, Defold) into the Qualia2D architecture.

## 2. RECENT CALIBRATIONS [v1.1]

### 2.1 SPATIAL PIVOT ZOOM
- **Standard**: Scaling from the center of the viewport is sub-optimal for high-density editing.
- **Implementation**: Adopted "Pivot-Zoom" logic. The camera pans during a zoom operation to ensure the world coordinate under the pointer remains stationary in screen-space.
- **Mathematical Bound**: $Cam_{new} = P_{world} - (P_{world} - Cam_{old}) \cdot \frac{Zoom_{old}}{Zoom_{new}}$.

### 2.2 CROSS-DEVICE NORMALIZATION
- **Mouse**: Wheel deltas mapped to multiplicative factors (0.9x / 1.1x).
- **Touch**: Pinch distance deltas mapped to the same multiplicative logic, using the pinch center as the pivot point.

## 3. LOGIC MATRIX: RUN_INDUSTRY [CONTEXT]

| Step | Action | Logic |
| :--- | :--- | :--- |
| 01 | **RESEARCH** | Identify how industry leaders handle [CONTEXT]. Focus on spatial partitioning, cache locality, and UI ergonomics. |
| 02 | **CALIBRATE** | Map the leading pattern to the Qualia2D ECS Store. |
| 03 | **MUTATE** | Apply the code changes to the relevant service. Prioritize performance (Big O) and Signal purity. |
| 04 | **VERIFY** | Log the "Industry Calibration" event in `memory.md`. |

## 4. SAFEGUARDS
- **Complexity Guard**: Do not implement features that exceed the Applet environment's resource limits.
- **Architecture Integrity**: Ensure new patterns do not violate "Zoneless" or "Signal-State Only" directives.
