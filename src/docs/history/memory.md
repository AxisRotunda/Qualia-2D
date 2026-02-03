# Memory Log

## [Init] Qualia2D Genesis
- **Action**: Initial system synthesis. Established Zoneless shell and Rapier2D integration.

## [v1.1 - v1.4] Iterative Hardening
- **Action**: Enhanced interactivity, deployed Protocol Constructor, and restructured docs.

## [v1.5 - v1.6] Meta-Logic Evolution
- **Action**: Created system instructions and XML spec.

## [v1.7] Protocol Correction & Manifesto Genesis
- **Action**: Corrected protocols and generated Qualia2D Manifesto.

## [v1.8] RPG Systems Integration
- **Action**: Executed `RUN_RPG_SYS`. Added Animation and Interaction systems.

## [v1.9] Architectural Refactor (Internal)
- **Action**: Consolidated services and optimized RenderSystem.

## [v1.10] Deep Refactor (RUN_REF)
- **Action**: Executed `RUN_REF` protocol.
- **Details**:
  - Eliminated redundant services in `src/services/`.
  - Enforced strict boundary: UI components now strictly use facades.
  - Refactored `CameraService` and `SelectionSystem`.

## [v1.11] UI & Config Refactor (RUN_REF)
- **Action**: Consolidated overlay state in `EngineState2DService`.
- **Action**: Extracted `LogViewerComponent` from `AppComponent` to isolate HUD logic.
- **Action**: Created `src/data/config/visual-config.ts` to externalize rendering constants from `RenderSystem`.
- **Outcome**: Portability Score (P) of the RenderSystem improved from 5 to 2. Root UI is now more maintainable and declarative.