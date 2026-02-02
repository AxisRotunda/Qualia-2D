# [T0] Safeguards & Validation

## 1. ARCHITECTURAL PROHIBITIONS

### 1.1 GEN_AI_ISOLATION
**STRICT PROHIBITION**: The integration of Gemini API, Google GenAI SDK, or any cloud-based Generative AI model into the Qualia2D runtime or editor is strictly forbidden. 
- **Reasoning**: To ensure 100% determinism, local-first performance, and to prevent "black-box" state mutation within the physics/ECS pipeline.
- **Enforcement**: Any PR or mutation adding `@google/genai` or similar dependencies must be rejected by the process.

## 2. CODE MUTATION GUARDS
- **Mutation Guard**: No contradiction vs Axial Directives allowed.
- **Zoneless Integrity**: Absolute prohibition of `zone.js`.
- **Signal-State Only**: State must exist within Signals for reactive performance.

## 3. WASM BOUNDARY SAFETY (RAPIER)
1. **Finite Guard**: Every numeric input reaching the physics solver must pass `Number.isFinite()`.
2. **Dimension Logic**: Collider dimensions MUST be `Math.floor()` integers where discrete units are required for consistency across platforms.