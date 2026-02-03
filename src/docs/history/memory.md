# Memory Log

## ... (Previous Entries)

## [v2.1] RUN_REF [STANDARD]: Monolith Decomposition
- **Action**: Decomposed `Engine2DService` monolith into `Runtime2DService` and `Selection2DService`.
- **Outcome**: Portability Score (P): 3.

## [v2.2] RUN_REF [STANDARD]: UI Decomposition & Runtime Hardening
- **Action**: Refactored `AppComponent` and its template to use a reusable `PanelDrawerComponent`.
- **Action**: Hardened `GameLoopService` by removing `NgZone`, enforcing 100% zoneless integrity across the simulation tick.
- **Action**: Pruned redundant header/close logic from `HierarchyComponent` and `EngineSettingsComponent`.
- **Context**: UI layer was becoming difficult to maintain due to nested side-panel logic. `NgZone` usage was a legacy dependency inconsistent with the Zoneless architecture.
- **Outcome**: Simplified UI tree and reduced change detection surface. Portability Score (P) maintained at 3.
