import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssetRegistryService {
  private textures = new Map<string, HTMLImageElement>();
  readonly isLoaded = signal(false);

  async loadTexture(id: string, url: string): Promise<HTMLImageElement> {
    if (this.textures.has(id)) return this.textures.get(id)!;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.textures.set(id, img);
        resolve(img);
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }

  getTexture(id: string): HTMLImageElement | undefined {
    return this.textures.get(id);
  }

  async loadDefaults() {
    try {
      await Promise.all([
        this.loadTexture('player_hero', 'https://picsum.photos/id/1/64/64'),
        this.loadTexture('box_crate', 'https://picsum.photos/id/60/64/64'),
        this.loadTexture('wall_stone', 'https://picsum.photos/id/10/128/128')
      ]);
      this.isLoaded.set(true);
    } catch (e) {
      console.error('Qualia2D: Asset load failure', e);
    }
  }
}