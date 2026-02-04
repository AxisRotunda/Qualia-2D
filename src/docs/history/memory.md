# Narrative Memory Index [T4]

## 1. CHRONICLE
For detailed machine-readable logs, consult `memory.json`.

### [v4.0] Protocol Constructor Overhaul
- **Action**: Integrated HtT and Step-Back Prompting.
- **Outcome**: **PROVEN PATTERN**. 
- **Ref**: `memory.json#e4f32`

### [v2.1] Memory Architecture Overhaul
- **Action**: Transitioned to Tiered Causal-Semantic Memory.
- **Outcome**: **ACTIVE**.
- **Context**: Enabling RAG-based retrieval for the Agent process.

---

## 2. FAILURE MANIFOLDS (Causal Trace Database)

### [FM001] Zone.js Reintroduction
- **Trigger**: Importing HttpClient without `provideHttpClient()`.
- **Causal Chain**: HttpClient → InterceptorChain → NgZone.run() → Crash.
- **Detection**: Runtime error: "Zone.js detected in Zoneless app".
- **Validated Fix**: Use fetch() API directly OR configure HttpClient with NoopInterceptor.
- **Confidence**: 100% (5/5 ops).

### [FM002] ECS Registry Desync
- **Trigger**: Signal update in `effect()` during physics tick.
- **Causal Chain**: effect() → GameLoopService.tick() → PhysicsSystem.step() → Rapier2D state desync.
- **Detection**: Entity position mismatch (render ≠ physics).
- **Validated Fix**: Use `computed()` for derived state OR defer updates to next frame via `queueMicrotask()`.
- **Confidence**: 87% (7/8 ops, 1 edge case unresolved).

### [FM003] Input Required Failure (NG0950)
- **Trigger**: Accessing `input.required()` in constructor.
- **Causal Chain**: Constructor call → Input signal undefined → Lifecycle error.
- **Detection**: `ERROR NG0950` at boot.
- **Validated Fix**: Move initialization to `ngOnInit()`.
- **Confidence**: 100% (Logged in issue-input-required-failure.md).

---

## 3. META-RULES (PROMOTED THEORIES)
Consult `src/docs/meta-rules/` for reusable architectural primitives.