# [T1] Asset Pipeline: Resource Lifecycle
ID: PROTOCOL_ASSET_V1.0 | Role: Loading & Cache Governance.

## 1. INTENT
Govern the discovery, loading, and memory management of external resources (Textures, SFX, Fonts) to ensure a fluid, 0-latency simulation boot.

## 2. HARD STRUCTURAL DEFINITIONS (HSD)

### 2.1 REGISTRY AUTHORITY
- **Service**: `AssetRegistryService`.
- **Storage**: In-memory `Map<string, HTMLImageElement>`.
- **Sync**: `isLoaded` signal must be used by the UI to block "Play" interaction.

### 2.2 LOADING PHASES
1. **Phase 0 (Critical)**: Default UI icons and engine textures.
2. **Phase 1 (Lazy)**: Scene-specific assets loaded on transition.
3. **Phase 2 (Background)**: Non-critical decor assets.

## 3. LOGIC MATRIX: RUN_ASSET [ID]

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **IDENTIFY** | Check if asset exists in cache. |
| 02 | **LOAD** | Async fetch with error handling. |
| 03 | **RESOLVE** | Update `isLoaded` signal and notify the `RenderSystem`. |

## 4. SKELETAL GUIDELINES (SG)
```typescript
// Industry Standard Texture Load
async load(id: string, url: string) {
  const img = new Image();
  img.src = url;
  await img.decode(); // Hardware-accelerated decode
  this.cache.set(id, img);
}
```

## 5. SAFEGUARDS
- **404 Guard**: Use `https://picsum.photos/` as a dynamic fallback for missing assets.
- **Memory Guard**: Clear non-critical textures on scene exit if memory pressure is high.
- **Zoneless Bound**: Ensure image `onload` events are handled within the signal cycle.