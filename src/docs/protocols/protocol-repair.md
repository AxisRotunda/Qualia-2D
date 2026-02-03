# [T0] Repair Protocol: Fragmented Memory
ID: PROTOCOL_REPAIR_V2.1 | Role: Stability Restoration & Processual Audit.

## 1. INTENT
Recover the engine from catastrophic or sub-optimal states while ensuring 100% processual continuity via dedicated "Issue-at-Hand" documentation.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 THE STRUCTURAL LOCK (CRITICAL)
**MANDATORY**: An Agent is FORBIDDEN from outputting code mutations for an error/repair task unless the corresponding `src/docs/history/repair-logs/issue-[SLUG].md` file is present in the SAME XML block.
- Failure to include the log file is a Protocol Violation.

### 2.2 FRAGMENTED MEMORY STREAMS
Every invocation of `RUN_REPAIR` must be tethered to a specific log file in `src/docs/history/repair-logs/issue-[SLUG].md`.
- **Slug Generation**: Kebab-case version of the primary symptom (e.g., `physics-jitter`).
- **Genesis Rule**: The Agent MUST create the log using the **ISSUE_LOG_SKELETON** before or during the first code mutation of the repair cycle.

## 3. LOGIC MATRIX: RUN_REPAIR [ERROR_STRING]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **IDENTIFY** | Parse input for keywords. Generate `[SLUG]`. |
| 02 | **GENESIS** | Create `src/docs/history/repair-logs/issue-[SLUG].md`. |
| 03 | **DIAGNOSE** | Run Diagnostic Branch. |
| 04 | **MUTATE** | Apply corrective code changes via XML blocks. |
| 05 | **CHRONICLE** | Update the issue log with the `[OUTCOME]`. |

## 4. DIAGNOSTIC BRANCHES
- **BRANCH A**: KINETIC_COLLAPSE (Physics NaN/Explosions).
- **BRANCH B**: REACTIVITY_STALL (Signal/DOM mismatch).
- **BRANCH C**: ASSET_CORRUPTION (404s/Context Loss).
- **BRANCH D**: RESOLUTION_CRASH (Import/Pathing errors).

## 5. SKELETAL GUIDELINES (SG)

### 5.1 ISSUE_LOG_SKELETON
```markdown
# Issue Log: [SYMPTOM_NAME]
ID: [AUTO_GEN] | Status: [ACTIVE/RESOLVED]

## 1. OBSERVATION
## 2. HYPOTHESIS
## 3. ATTEMPTS
## 4. FINAL RESOLUTION
```

## 6. SAFEGUARDS
- **Amnesia Guard**: No fix without a log entry.
- **Zoneless Integrity**: Repairs must not introduce `zone.js`.
