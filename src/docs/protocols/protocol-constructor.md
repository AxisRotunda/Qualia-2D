# [T0] Protocol Constructor
ID: PROTOCOL_CONSTRUCTOR_V4.0 | Version: 4.0 | Role: Meta-Genesis Framework.

## 1. INTENT
Govern the genesis and recursive evolution of QualiaVerbs. v4.0 introduces **Step-Back Prompting** and **Hypotheses-to-Theories (HtT)** to ensure scientific empiricism in code mutation.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### [H0.5] HYPOTHESIS & THEORY PHASE (HtT)
Before any protocol mutation:
1. **Hypothesis**: "Mutating [target] will improve [metric] by [expected %]".
2. **Falsification**: "This fails if [observable condition]".
3. **Theory**: After mutation, measure delta. If validated → promote to **Proven Pattern** in `memory.md`.

### [H1] SIH DETERMINISM
- **Mandate**: `SIH` must now include a `reasoning_chain_hash` for deterministic continuity.
- **Sync**: Recalculate hash after every `RUN_VALIDATE`.

## 3. LOGIC MATRIX: RUN_PROTOCOL [TARGET] (V4.0)

| Step | Action | Description | Reasoning Layer |
| :--- | :--- | :--- | :--- |
| 00 | **STEP-BACK** | Generate high-level context | "Why does this exist? What invariant does it maintain?" |
| 01 | **CALIBRATE** | Retrieve Protocol + SIH | Verify no race conditions. |
| 02 | **META-SCAN** | RAG retrieval from memory | Find Top-5 similar ops + outcomes. |
| 03 | **HYPOTHESIS** | State falsifiable outcome | "Works because [causal chain]. Predicted impact: [metric]." |
| 04 | **DECOMPOSE** | Atomic sub-mutations | Target single files/services. |
| 05 | **MUTATE** | Apply with inline CoT | `// CoT: [Causal reasoning for this line]`. |
| 06 | **HASH** | Regenerate `STRUCTURAL_HASH` | Cryptographic verification. |
| 07 | **VALIDATE** | Regression test suite | If fails → rollback + Log Anti-Pattern. |

## 4. META-ITERATION PIPELINE

### 4.1 COMPLEXITY-BASED EXEMPLAR SELECTION
1. **Rank past ops**: Simple (1-3 steps) vs Complex (7+ steps).
2. **Few-Shot**: Include 2-3 complex exemplars in new protocol genesis.
3. **Curation**: Prune redundant/outdated examples every 50 mutations.

## 5. STRUCTURAL_HASH
SIH: `QUALIA_CONST_4.0_F7A31`