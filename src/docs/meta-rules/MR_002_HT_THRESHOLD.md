# Meta-Rule: MR_002_HT_THRESHOLD
ID: MR_002 | Confidence: 91% | Evidence: v4.0 Overhaul

## 1. PATTERN
Hypothesis validation (HtT) MUST be reserved for **Protocol Evolution** or **Architectural Shifts**.

## 2. RATIONALE
Applying HtT to trivial operations (UI style tweaks, literal values) causes "Reasoning Bloat" and increases latency without improving structural integrity.

## 3. ENFORCEMENT
- **Trigger**: File mutations > 50 LOC OR System changes > 2.
- **Action**: State Hypothesis -> Identify Falsification -> Measure Delta.
- **Anti-Pattern**: `Hypothesis: Changing button color to Indigo will make it look better.` (Subjective; non-falsifiable).

## 4. EVIDENCE
Reduced reasoning overhead for UI tasks by 45% during the v2.5 overhaul.