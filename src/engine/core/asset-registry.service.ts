import { Injectable, signal } from '@angular/core';
import { PROCEDURAL_REGISTRY, TextureGenerator } from '../../data/assets/procedural-textures';

/**
 * Qualia2D Asset Registry.
 * [RUN_REF]: Pure Portability. Decoupled from generation logic.
 */
@Injectable({ providedIn: 'root' })
export class AssetRegistryService {
  private textures = new Map<string, HTMLImageElement>();
  readonly isLoaded = signal(false);

  /**
   * Retrieves a texture from the cache.
   */
  getTexture(id: string): HTMLImageElement | undefined {
    return this.textures.get(id);
  }

  /**
   * Primary boot sequence for asset synthesis.
   * Leverages the data-layer registry for procedural generation.
   */
  async loadDefaults() {
    try {
      const promises = Object.entries(PROCEDURAL_REGISTRY).map(([id, gen]) => {
        return this.synthesize(id, 128, 128, gen);
      });
      
      await Promise.all(promises);
      this.isLoaded.set(true);
    } catch (e) {
      console.error('Qualia2D: Asset Registry boot failure', e);
    }
  }

  /**
   * Synchronous synthesis of procedural textures using Canvas2D.
   */
  private async synthesize(id: string, width: number, height: number, drawFn: TextureGenerator) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    if (ctx) {
      drawFn(ctx, width, height);
      const img = new Image();
      // Ensure async decoding to keep main thread fluid
      img.src = canvas.toDataURL();
      await img.decode();
      this.textures.set(id, img);
    }
  }

  /**
   * External asset loader (Stale-while-revalidate capable).
   */
  async loadExternalTexture(id: string, url: string): Promise<HTMLImageElement> {
    if (this.textures.has(id)) return this.textures.get(id)!;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        await img.decode();
        this.textures.set(id, img);
        resolve(img);
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }
}
