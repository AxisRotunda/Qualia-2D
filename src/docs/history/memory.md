# Memory Log

## [Init] Qualia2D Genesis
- **Action**: Initial system synthesis. Established Zoneless shell and Rapier2D integration.

## [v1.1 - v1.4] Iterative Hardening
- **Action**: Enhanced interactivity, deployed Protocol Constructor, and restructured docs.

## [v1.5 - v1.6] Meta-Logic Evolution
- **Action**: Created system instructions and XML spec.

## [v1.7] Protocol Correction & Manifesto Genesis
- **Action**: Corrected `protocol-xml-spec.md` and `system-instructions.md`.
- **Action**: Generated `qualia2d-manifesto.md`.

## [v1.8] RUN_KNOWLEDGE: Architectural Synthesis
- **Action**: Synthesized `ecs-architecture.md`, `physics-integration.md`, and `rendering-pipeline.md`.

## [v1.9] RUN_KNOWLEDGE: Operational Synthesis
- **Action**: Synthesized `input-pipeline.md`, `scene-lifecycle.md`, and `camera-projection.md`.

## [v1.10] RUN_REF: UI Modularization
- **Action**: Refactored `MainMenuComponent` monolith. Extracted child components.

## [v1.11] RUN_GUIDE_GEN: Human Translation Protocol
- **Action**: Deployed `PROTOCOL_GUIDE_GEN_V1.0` to manage interactive guide synthesis.
- **Action**: Refined 'Movement DNA', 'Physical Laws', and 'Tactile Link' guides to prioritize visual inference and layman clarity.
- **Action**: Decoupled human content from semantic technical documentation syncs.
- **Outcome**: Engine UX now provides clear, aesthetic onboarding with minimal text density.

## [v1.12] RUN_REPAIR: Touch Unresponsiveness
- **Action**: Implemented `REPAIR_TOUCH_V1.0`. Hardened input pipeline against event bubbling and passive listeners on mobile.
- **Outcome**: Joypads and Overlays no longer conflict with Viewport camera control.

## [v1.13] REPAIR_GUIDES: Visual Schema Mismatch
- **Action**: Diagnosed missing UI handling for `input` schema in `MenuGuideTabComponent`.
- **Mutation**: Added dedicated D-Pad icon rendering for `input` schemaId.
- **Protocol**: Updated `protocol-ui.md` to mandate visual coverage for all defined schemas.
- **Outcome**: "Tactile Link" guide now correctly reflects its category in the Main Menu.

## [v1.14] RUN_REPAIR: Guide Registry Desync
- **Action**: Diagnosed missing "Forces" guide in Main Menu despite protocol existence.
- **Mutation**: Synthesized `forces-dynamics.ts` and registered it in `GUIDE_REGISTRY`.
- **Outcome**: Main Menu now properly reflects the full set of 4 core engine protocols.
