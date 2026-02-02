# [T0] Industry Protocol
ID: PROTOCOL_INDUSTRY_V1.0 | Role: Standards & Modernization.

## 1. INTENT
To research, analyze, and integrate leading-edge industry standards from established 2D engines (Godot, Unity, PixiJS, Defold) into the Qualia2D architecture. This ensures the engine remains competitive in performance, ergonomics, and technical capability.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)
- **Phase 1: Research**: Retrieval of industry-standard patterns for a specific domain (e.g., Rendering, Physics, Selection).
- **Phase 2: Context Fit**: Analysis of research findings against Qualia2D constraints (Zoneless, ECS, Rapier2D, Canvas2D).
- **Phase 3: Integration**: Implementation of the "Best Fit" pattern using Angular Signals and ECS.

## 3. LOGIC MATRIX: RUN_INDUSTRY [CONTEXT]

| Step | Action | Logic |
| :--- | :--- | :--- |
| 01 | **RESEARCH** | Identify how industry leaders handle [CONTEXT]. Focus on spatial partitioning, cache locality, and UI ergonomics. |
| 02 | **CALIBRATE** | Map the leading pattern to the Qualia2D ECS Store. If it requires a new component, define it via `RUN_PROTOCOL`. |
| 03 | **MUTATE** | Apply the code changes to the relevant service. Prioritize performance (Big O) and Signal purity. |
| 04 | **VERIFY** | Log the "Industry Calibration" event in `memory.md`. |

## 4. SKELETAL GUIDELINES (SG)
- **Physics Queries**: Prefer Rapier2D's internal spatial queries (Raycast, Point Projection) over manual iteration.
- **Rendering**: Use industry-standard layering (Z-sorting) or batching where applicable.
- **ECS**: Use "Tagging" for fast filtering of entity subsets.

## 5. SAFEGUARDS
- **Complexity Guard**: Do not implement features that exceed the Applet environment's resource limits (keep WASM heap clean).
- **Architecture Integrity**: Ensure new patterns do not violate the "Zoneless" or "Signal-State Only" directives.