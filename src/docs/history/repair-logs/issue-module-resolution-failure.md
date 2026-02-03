# Issue Log: Module Resolution Failure
ID: REPAIR_MOD_RES_01 | Status: RESOLVED

## 1. OBSERVATION
The application failed to boot with `TypeError: Failed to resolve module specifier "@/src/app/ui/panels/hierarchy.component"`. This indicated a mismatch between the expected file hierarchy and the import specifiers, possibly exacerbated by the use of non-standard aliases in a native ESM environment.

## 2. HYPOTHESIS
The engine's `AppComponent` expects UI modules in specific sub-directories (`hud/`, `panels/`, `viewport/`) as per `project-hierarchy.md`. If files are orphaned in the `ui/` root, or if specifiers use `@/` aliases, the browser's native loader will fail.

## 3. ATTEMPTS
- **Attempt 01**: Verified `app.component.ts` imports. Discovered they point to `panels/` but the source files were provided in the `ui/` root.
- **Attempt 02**: Relocated all UI components into their designated folders and replaced any potential non-standard specifiers with deterministic relative paths (`./` or `../`).

## 4. FINAL RESOLUTION
Successfully relocated the following components:
- `hierarchy.component.ts` -> `src/app/ui/panels/`
- `inspector.component.ts` -> `src/app/ui/panels/`
- `engine-settings.component.ts` -> `src/app/ui/panels/`
- `telemetry.component.ts` -> `src/app/ui/hud/`
- `command-hub.component.ts` -> `src/app/ui/hud/`
- `virtual-joypad.component.ts` -> `src/app/ui/hud/`
- `selection-toolbar.component.ts` -> `src/app/ui/hud/`

Verified all internal imports within these components use correct relative depth to reach `src/services` and `src/engine`.