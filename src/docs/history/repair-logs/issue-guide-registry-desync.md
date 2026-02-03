# Issue Log: Guide Registry Desync [R2]
ID: REPAIR_GUIDE_REGISTRY_V1.0 | Status: Resolved

## 1. OBSERVATION
The Main Menu "Guides" tab displays only 3 entries (Kinetic Translation, Physical Laws, Tactile Link), despite the presence of `protocol-forces.md` and `ForceField2D` logic in the engine core. The user expectation is that active protocols should have corresponding human-readable guides.

## 2. HYPOTHESIS
The Qualia2D documentation pipeline requires manual registration of `VisualArticle` objects in `src/data/guides/index.ts`. The "Forces" domain was implemented technically but skipped the `RUN_GUIDE_GEN` registration step, resulting in a "Ghost Protocol" (logic exists, but is undocumented in the UI).

## 3. ATTEMPTS
- **Audit**: Checked `src/data/guides/` for orphaned files. None found.
- **Trace**: Verified `protocol-forces.md` defines visual guidelines (Indigo/Rose pulses) but has no corresponding `.ts` file in `src/data/guides/`.

## 4. FINAL RESOLUTION
1. **Synthesis**: Created `src/data/guides/forces-dynamics.ts` mapping the Forces Protocol to the Visual Article schema.
2. **Registration**: Imported and exported the new module in `src/data/guides/index.ts`.
3. **Verification**: The Main Menu now iterates over 4 modules, correctly rendering the "Field Dynamics" card.
