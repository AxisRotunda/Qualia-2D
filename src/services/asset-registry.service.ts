
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssetRegistryService {
  private textures = new Map<string, HTMLImageElement>();
  readonly isLoaded = signal(false);

  /**
   * Loads or retrieves a texture.
   */
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

  /**
   * Generates high-fidelity procedural "Dev Textures" in-memory.
   * [RUN_REF]: Ensures engine is self-contained and visually cohesive.
   */
  async loadDefaults() {
    try {
      // 1. Hero Glyph (Directional Pointer)
      this.generateTexture('tex_hero', 128, 128, (ctx, w, h) => {
        const cx = w/2, cy = h/2;
        ctx.strokeStyle = '#6366f1'; 
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.moveTo(cx + 40, cy); 
        ctx.lineTo(cx - 20, cy - 30);
        ctx.lineTo(cx - 10, cy);
        ctx.lineTo(cx - 20, cy + 30);
        ctx.fill();
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 20;
      });

      // 2. Industrial Crate
      this.generateTexture('tex_crate', 128, 128, (ctx, w, h) => {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 6;
        ctx.strokeRect(4,4,w-8,h-8);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(w,h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w,0); ctx.lineTo(0,h); ctx.stroke();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.strokeRect(0,0,w,h);
      });

      // 3. Structural Wall
      this.generateTexture('tex_wall', 128, 128, (ctx, w, h) => {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
        ctx.beginPath(); 
        for(let i=0; i<w; i+=32) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
        for(let i=0; i<h; i+=32) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
        ctx.stroke();
        ctx.fillStyle = '#1e293b'; ctx.fillRect(10, 10, 20, 10);
      });

      // 4. Hero Sprite Sheet (4x4 Grid - 128x128 total, 32x32 frames)
      // Row 0: Down, Row 1: Up, Row 2: Left, Row 3: Right
      this.generateTexture('tex_hero_sheet', 128, 128, (ctx, w, h) => {
        const frameSize = 32;
        const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
        
        for (let row = 0; row < 4; row++) {
           for (let col = 0; col < 4; col++) {
             const x = col * frameSize;
             const y = row * frameSize;
             
             ctx.fillStyle = row % 2 === 0 ? '#1e293b' : '#0f172a';
             // ctx.fillRect(x, y, frameSize, frameSize); // Debug bg
             
             const cx = x + frameSize / 2;
             const cy = y + frameSize / 2;
             
             ctx.fillStyle = colors[col];
             ctx.beginPath();
             ctx.arc(cx, cy, 10 + (col * 2), 0, Math.PI * 2);
             ctx.fill();

             // Direction Indicator
             ctx.fillStyle = '#fff';
             if (row === 0) ctx.fillRect(cx - 2, cy + 8, 4, 4); // Down
             if (row === 1) ctx.fillRect(cx - 2, cy - 12, 4, 4); // Up
             if (row === 2) ctx.fillRect(cx - 12, cy - 2, 4, 4); // Left
             if (row === 3) ctx.fillRect(cx + 8, cy - 2, 4, 4); // Right
           }
        }
      });

      this.isLoaded.set(true);
    } catch (e) {
      console.error('Qualia2D: Procedural Asset Generation Failed', e);
    }
  }

  private generateTexture(id: string, width: number, height: number, drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawFn(ctx, width, height);
      const img = new Image();
      img.src = canvas.toDataURL();
      this.textures.set(id, img);
    }
  }
}