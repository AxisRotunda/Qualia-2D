# Project Hierarchy

## /src
- **app.component.ts**: Root UI orchestrator and interaction layer.
- **docs/**: Project brain (Kernel, History, Specs).
- **engine/**:
  - **ecs/**: Entity Component System core (Store, ID Gen).
  - **runtime/**: Game Loop, Time step logic.
  - **scene.types.ts**: Interfaces for Scene definitions.
- **services/**: Angular Services acting as Systems (Physics, Renderer, State).
- **data/**: Static definitions (Scenes, Templates).
- **content/**: Assets (if any).

## /src/docs
- **kernel.md**: The constitutional rules of the engine.
- **history/memory.md**: Chronological log of changes.
- **core/project-hierarchy.md**: This file.
