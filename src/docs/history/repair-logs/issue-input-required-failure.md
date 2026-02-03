# Issue Log: Input Required Failure [NG0950]
ID: REPAIR_INPUT_REQ_V1.0 | Status: Resolved

## 1. OBSERVATION
The application fails at runtime with `ERROR NG0950: Input is required but no value is available yet`. This error occurs in Angular v16+ when an `input.required()` signal is accessed before it has been initialized with a value from the parent component.

## 2. HYPOTHESIS
- **Hypothesis A**: A component is accessing `this.myInput()` inside its `constructor`. Signal inputs are not available during the constructor phase; they are only populated during the first change detection cycle, specifically by `ngOnInit`.
- **Hypothesis B**: A required input is bound to an expression that evaluates to `undefined` or `null` during the initial render, even if protected by an `@if` block, if the timing of signal propagation is delayed.

## 3. ATTEMPTS
- **Audit**: Identified `MenuLaunchModalComponent` as a primary suspect. It attempts to read `this.scene()` in the constructor to initialize local state.
- **Trace**: Verified that `AppComponent` uses `@if (state.selectedEntityId(); as id)` for the `SelectionToolbarComponent`. While logically sound, this check fails if `id` is `0`.

## 4. FINAL RESOLUTION
1. **Lifecycle Correction**: Moved the initialization logic in `MenuLaunchModalComponent` from the `constructor` to `ngOnInit`. This ensures the required `scene()` input is populated before use.
2. **Robust Selection Guard**: Updated `app.component.html` to use an explicit `null` check: `@if (state.selectedEntityId() !== null)`. This prevents potential issues with ID `0` and ensures the child component only mounts when data is guaranteed.
3. **Architecture Cleanup**: (Implicit) Verified that all components provided in sub-directories (`hud/`, `panels/`) are correctly referenced, reducing confusion with orphaned files in the `ui/` root.

## 5. VERIFICATION
- Result: `NG0950` is cleared. The launch modal correctly inherits the preferred topology from the selected scene fragment.