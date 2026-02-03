
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
   * [RUN_INDUSTRY]: Implements "Hard Realism" via noise, gradients, and structural bevels.
   */
  async loadDefaults() {
    try {
      // 1. Hero Glyph (Directional Pointer)
      this.generateTexture('tex_hero', 128, 128, (ctx, w, h) => {
        const cx = w/2, cy = h/2;
        
        // Glow Gradient
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
        grad.addColorStop(0, '#818cf8');
        grad.addColorStop(1, '#4338ca');
        
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI*2); ctx.fill();

        // Metallic Rim
        ctx.strokeStyle = '#c7d2fe'; 
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, 48, 0, Math.PI*2); ctx.stroke();

        // Directional Chevron
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(cx + 35, cy); 
        ctx.lineTo(cx - 15, cy - 25);
        ctx.lineTo(cx - 5, cy);
        ctx.lineTo(cx - 15, cy + 25);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Industrial Crate (Sci-Fi Cargo)
      this.generateTexture('tex_crate', 128, 128, (ctx, w, h) => {
        // Base Metal
        ctx.fillStyle = '#334155'; // Slate 700
        ctx.fillRect(0,0,w,h);
        this.applyNoise(ctx, w, h, 15);

        // Frame Bevels
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#1e293b'; // Darker
        ctx.strokeRect(4,4,w-8,h-8);
        
        // Inner Recess
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(16, 16, w-32, h-32);
        
        // Hazard Stripes (Diagonal)
        ctx.save();
        ctx.beginPath();
        ctx.rect(20, 20, w-40, h-40);
        ctx.clip();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0,0,w,h);
        
        ctx.fillStyle = '#ca8a04'; // Dark Yellow
        for(let i=-w; i<w*2; i+=20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i+10, 0);
            ctx.lineTo(i-10+h, h);
            ctx.lineTo(i-20+h, h);
            ctx.fill();
        }
        ctx.restore();

        // Reinforcement X
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(10, 10); ctx.lineTo(w-10, h-10);
        ctx.moveTo(w-10, 10); ctx.lineTo(10, h-10);
        ctx.stroke();

        // Rivets
        ctx.fillStyle = '#94a3b8';
        const r = 3;
        const inset = 8;
        ctx.beginPath();
        ctx.arc(inset, inset, r, 0, Math.PI*2);
        ctx.arc(w-inset, inset, r, 0, Math.PI*2);
        ctx.arc(w-inset, h-inset, r, 0, Math.PI*2);
        ctx.arc(inset, h-inset, r, 0, Math.PI*2);
        ctx.fill();
      });

      // 3. Structural Wall (Reinforced Concrete)
      this.generateTexture('tex_wall', 128, 128, (ctx, w, h) => {
        // Concrete Base
        ctx.fillStyle = '#0f172a'; 
        ctx.fillRect(0,0,w,h);
        this.applyNoise(ctx, w, h, 25);

        // Plating Lines
        ctx.strokeStyle = '#1e293b'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
        ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
        ctx.stroke();

        // Tech Detailing
        ctx.fillStyle = '#334155';
        ctx.fillRect(10, 10, 30, 10);
        ctx.fillRect(w-40, h-20, 30, 10);

        // Warning Light (Red)
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath(); ctx.arc(w/2, h/2, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(w/2, h/2, 2, 0, Math.PI*2); ctx.fill();
      });

      // 4. Hero Sprite Sheet (Updated for Consistency)
      this.generateTexture('tex_hero_sheet', 128, 128, (ctx, w, h) => {
        const frameSize = 32;
        const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
        
        for (let row = 0; row < 4; row++) {
           for (let col = 0; col < 4; col++) {
             const x = col * frameSize;
             const y = row * frameSize;
             
             // Background
             ctx.fillStyle = row % 2 === 0 ? '#1e293b' : '#0f172a';
             
             const cx = x + frameSize / 2;
             const cy = y + frameSize / 2;
             
             // Body
             ctx.fillStyle = colors[col];
             ctx.beginPath();
             ctx.arc(cx, cy, 10 + (col * 1), 0, Math.PI * 2);
             ctx.fill();

             // Visor / Direction Indicator
             ctx.fillStyle = '#fff';
             if (row === 0) ctx.fillRect(cx - 3, cy + 6, 6, 3); // Down
             if (row === 1) ctx.fillRect(cx - 3, cy - 9, 6, 3); // Up
             if (row === 2) ctx.fillRect(cx - 9, cy - 3, 3, 6); // Left
             if (row === 3) ctx.fillRect(cx + 6, cy - 3, 3, 6); // Right
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

  private applyNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
    const idata = ctx.getImageData(0, 0, w, h);
    const data = idata.data;
    for(let i = 0; i < data.length; i += 4) {
       // Simple additive noise
       const n = (Math.random() - 0.5) * amount;
       data[i] = Math.max(0, Math.min(255, data[i] + n));
       data[i+1] = Math.max(0, Math.min(255, data[i+1] + n));
       data[i+2] = Math.max(0, Math.min(255, data[i+2] + n));
    }
    ctx.putImageData(idata, 0, 0);
  }
}
