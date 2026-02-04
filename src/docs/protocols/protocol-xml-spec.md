# [T0] XML Mutation Specification
ID: PROTOCOL_XML_SPEC_V1.5 | Role: Structural Integrity Guard.

## 1. THE XML SCHEMA (SIH & CoT ENABLED)
Every update MUST be contained within a single XML block. v1.5 requires a **Heuristic Report** to be prepended to the block for validation.

```xml
<changes>
  <change>
    <file>[full_path]</file>
    <description>[summary_of_change]</description>
    <content><![CDATA[
      // CoT: [Reasoning for specific logic choice]
      Full file content
    ]]]]><![CDATA[></content>
  </change>
</changes>
```

## 2. REFINEMENT HEURISTICS (V1.5)
1. **SIH Compliance**: If modifying a Protocol, you MUST update the `STRUCTURAL_HASH`.
2. **Heuristic Header**: Prepend the block with: `Action/Context/Hypothesis/Confidence`.
3. **Container Integrity (CRITICAL)**: Opening/closing tags MUST reside in the same block scope.
4. **Inline CoT**: High-stakes logic must include `// CoT:` comments explaining the causal link.

## 3. ANTI-PATTERN REGISTRY (FATAL)
- **Template Regex**: Forbidden.
- **Raw DOM Mutation**: Forbidden.
- **Zone.js Import**: Fatal.
- **SIH Desync**: Prevents commit.

## 4. VALIDATION HOOK
The `RUN_VALIDATE` command is automatically invoked after every XML block generation.

## 5. STRUCTURAL_HASH
SIH: `QUALIA_XML_1.5_FF9A1`]]></content>
  </change>
  <change>
    <file>src/docs/history/memory.md</file>
    <description>Log v2.0 overhaul: Meta-Evolution to Intelligence Kernel T1/T2.</description>
    <content><![CDATA[# Memory Log

## [Init - v1.9] Pre-Evolution
- **Action**: Established ECS, Obsidian Glass, and basic QualiaVerbs.

## [v2.0] Meta-Evolution: T1 Intelligence Kernel Active
- **Action**: Overhauled `system-instructions.md` to V2.0 using advanced CoT and HtT frameworks.
- **Action**: Integrated Mechanistic Validation into `protocol-validator.md`.
- **Action**: Updated `protocol-xml-spec.md` to V1.5 requiring Heuristic Reports.
- **Context**: Transitioning engine logic to a self-validating, probabilistic reasoning model.
- **Outcome**: SIH verified for all core docs. Mutation confidence now calculated based on historical manifolds. Application hardened against structural decay.
- **SIH Sync**: 
  - `QUALIA_KERNEL_2.0_8D4F1`
  - `QUALIA_VALID_2.0_9B1E2`
  - `QUALIA_XML_1.5_FF9A1`]]></content>
  </change>
</changes>
```