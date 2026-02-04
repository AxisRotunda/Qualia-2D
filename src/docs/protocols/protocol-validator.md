# [T0] Protocol Validator
ID: PROTOCOL_VALIDATOR_V3.0 | Version: 3.0 | Role: Integrity Enforcement.

## 1. INTENT
Provide an irreducible logic layer for validating code mutations, structural integrity, and SIH compliance. v3.0 introduces **HtT Verification** and **Step-Back Context Audit** to align with the V4.0 Constructor.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 HASHING & SIH
- **Algorithm**: `SIH = Base64(SHA256(ID + Version + ContentSignature))`.
- **Mandate**: A mutation is valid only if `SIH_current == SIH_registry`.

### 2.2 EMPIRICAL CHECKS (HtT)
1. **Hypothesis Presence**: Every mutation affecting > 50 LOC must include a formal hypothesis.
2. **Falsification Guard**: Rejects mutations that lack clear failure criteria.
3. **Context Check**: Verifies "Step-Back" reasoning (Step 00) is present in the heuristic report.

## 3. LOGIC MATRIX: RUN_VALIDATE [FILE_PATH]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **SIGNATURE** | Generate `ContentSignature` and verify SIH. |
| 02 | **HT_AUDIT** | Verify Hypothesis and Falsification criteria match the intent. |
| 03 | **STEP_BACK** | Verify high-level architectural context was established. |
| 04 | **CAUSAL_SCAN** | Verify inline `// CoT:` comments against the reasoning hypothesis. |
| 05 | **PROB_CHECK** | Calculate regression probability. Trigger review if > 0.15. |
| 06 | **EMIT** | Log outcome to `memory.md` using the V2.0+ structured JSON format. |

## 4. ADVANCED SAFEGUARDS
- **Zoneless Boundary**: Scan for `zone.js` imports or `NgZone` usage (FATAL).
- **AP Detection**: Match code against `failure-manifolds.md` patterns before commit.

## 5. STRUCTURAL_HASH
SIH: `QUALIA_VALID_3.0_E4C92`