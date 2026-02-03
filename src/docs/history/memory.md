
# Memory Log

## ... (Previous Entries)

## [v1.19] Repair: PWA Sandbox Bypass
- **Command**: `RUN_REPAIR`
- **Action**: Implemented `popOut()` strategy.
- **Outcome**: Partially successful, but failed in Blob environments.

## [v1.20] Repair: PWA Blob Crash Fix
- **Command**: `RUN_REPAIR`
- **Analysis**: User encountered `ERR_FILE_NOT_FOUND` (Blob URL) when using "Launch External". This confirms AI Studio previews use ephemeral Blob URLs which cannot be opened in new tabs.
- **Action**: Updated `PwaService` to detect `blob:` protocol.
- **Action**: Replaced "Launch External" with "Fullscreen Mode" specifically for Blob environments. This simulates the PWA experience without crashing.
- **Action**: Updated `protocol-pwa.md` to V1.4 to codify the Blob Restriction.
- **Outcome**: The application no longer crashes when "launching" from a preview; it now offers a valid alternative (Fullscreen) for immersion.
