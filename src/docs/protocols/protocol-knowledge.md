# [T0] Knowledge Protocol
ID: PROTOCOL_KNOWLEDGE_V1.0 | Role: Context Synchronization.

## 1. INTENT
To ensure the engine's internal documentation mirrors the actual code state and provides a high-density context for Agent processes.

## 2. EXECUTION STEPS
1. **Directory Crawl**: Scan `src/` for new files not present in `project-hierarchy.md`.
2. **Doc Alignment**: Cross-reference `axial-directives.md` with recent `memory.md` logs.
3. **Context Injection**: Update file headers in services to include ID tags.
4. **Pruning**: Remove deprecated history logs that exceed context window limits.

## 3. SUCCESS CRITERIA
- `project-hierarchy.md` is 100% accurate.
- `kernel.md` links are all functional.
- Zero orphaned files in the project root.