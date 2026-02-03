
# [T0] PWA Protocol
ID: PROTOCOL_PWA_V1.4 | Role: App Lifecycle Management.

## 1. INTENT
To elevate Qualia2D from a browser tab to a native-class application via Progressive Web App (PWA) standards. This protocol governs the Manifest, Service Worker, and handles Environmental Constraints (Sandboxing).

## 2. ENVIRONMENTAL CONSTRAINTS (SANDBOX AWARENESS)

### 2.1 The Iframe Restriction
In AI Studio, the application runs within an `<iframe>`. Browsers strictly prohibit PWA installation prompts from cross-origin iframes.
- **Rule**: If `window.self !== window.top`, the native `beforeinstallprompt` will likely not fire.

### 2.2 The Blob Restriction (Ephemeral Preview)
If the application is running via a `blob:` URL (common in AI Studio live previews), it has no persistent origin.
- **Constraint**: `window.open()` on a blob URL will fail in a new tab (ERR_FILE_NOT_FOUND).
- **Recovery**: Do NOT attempt to "pop out" a blob URL. Instead, offer a "Fullscreen Mode" to simulate the standalone experience.

## 3. HARD STRUCTURAL DEFINITIONS (HSD)

### 3.1 The Manifest
- **Display**: `standalone`.
- **Orientation**: `landscape`.
- **Theme**: `#020617`.

### 3.2 The Service Worker
- **Strategy**: Stale-While-Revalidate.
- **Scope**: Core assets cached at boot.

## 4. INSTALLATION LOGIC MATRIX

| State | Condition | UI Behavior |
| :--- | :--- | :--- |
| **Blob Preview** | `isBlob === true` | Display "Fullscreen Mode" (Simulate Standalone). |
| **Standard Iframe** | `isIframe === true` | Display "Launch External" CTA to escape frame. |
| **Installable** | `isInstallable === true` | Display "Install Qualia2D" CTA with Indigo branding. |
| **Installed** | `isStandalone === true` | Display "Standalone Mode" with Emerald success theme. |

## 5. UI GUIDELINES
- **Placement**: Settings Drawer -> Application Section.
- **Transparency**: Be explicit about *why* installation might be unavailable (e.g. Preview vs Hosted).
- **Aesthetic**: Indigo/Emerald themed cards.

## 6. SAFEGUARDS
- **Crash Prevention**: Never call `window.open()` on a blob URL.
- **Origin Guard**: Service Workers require HTTPS.
- **State Cleanup**: Always reset the deferred prompt after usage or cancellation.
