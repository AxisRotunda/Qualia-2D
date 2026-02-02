# [T0] UI Protocol
ID: PROTOCOL_UI_V1.0 | Role: Aesthetic Verification.

## 1. INTENT
Enforce the "Obsidian Glass" design language across all HUD elements.

## 2. AUDIT CHECKLIST
1. **Glass Integrity**: Verify `backdrop-blur` and `bg-slate-950/xx` opacity.
2. **Typography**: Ensure `JetBrains Mono` for telemetry and `Inter` for controls.
3. **Interactivity**: Every button must have `active:scale-90`.
4. **Contrast**: Check 4.5:1 ratio for all data readouts.

## 3. COMPONENT VALIDATION
- Floating pills must have `shadow-2xl`.
- Side drawers must use the specified `cubic-bezier` transition.