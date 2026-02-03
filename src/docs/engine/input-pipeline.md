# [T1] Input Pipeline: Device Normalization
ID: ENGINE_INPUT_V1.0 | Role: Hardware-to-Intent Translation.

## 1. OVERVIEW
The Qualia2D input pipeline is designed for "Tactile Parity"—ensuring that the simulation feels identical across desktop (Mouse/Keyboard) and mobile (Touch/Joypad) environments. This is achieved through a multi-stage normalization process in `Input2DService`.

## 2. PIPELINE STAGES

### [S0] HARDWARE CAPTURE
- **Mouse**: Tracks screen-space deltas and button states.
- **Touch**: Multi-finger capture with ID persistence (crucial for virtual sticks).
- **Keyboard**: Normalized key strings (lowercase) stored in a reactive Set.

### [S1] DEVICE DETECTION
The system identifies the primary `InteractionDevice` ('mouse' | 'touch') based on the last active event. This toggle adjusts:
- **Selection Tolerance**: Touch uses a larger intersection radius (0.6 units) vs Mouse (0.1 units).
- **UI Visibility**: Joypads and mobile-specific toolbars react to the active device signal.

### [S2] VECTOR NORMALIZATION (THE CORE)
To prevent "Diagonal Speed Explots", all intent vectors (Movement/Look) must be normalized.
- **Logic**: `Vector / Magnitude`.
- **Joypad**: Raw thumb delta is mapped to a circular deadzone with a distance cap (40px).

### [S3] COORDINATE PROJECTION
World-space cursor position is calculated by projecting screen coordinates through the active `CameraService` zoom and pan state.

## 3. INVARIANTS
1. **Device Isolation**: Movement logic must consume `moveVector()`, never raw key states.
2. **Determinism**: The same physical thumb displacement must result in the same world-space impulse.
3. **Reactivity**: Hardware state must be normalized into Signals before reaching the `ControllerSystem`.

## 4. SAFEGUARDS
- **Frame Independence**: Input vectors are unit-length; scaling by speed and delta-time happens in the simulation systems.
- **Conflict Resolution**: Virtual stick input overrides keyboard input to prevent multi-input jitter.