/**
 * Obsidian Glass: Procedural Asset Synthesis [DATA LAYER]
 * ID: PROCEDURAL_TEXTURES_V1.2
 */

export type TextureGenerator = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export const applyNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) => {
  const idata = ctx.getImageData(0, 0, w, h);
  const data = idata.data;
  for(let i = 0; i < data.length; i += 4) {
     const n = (Math.random() - 0.5) * amount;
     data[i] = Math.max(0, Math.min(255, data[i] + n));
     data[i+1] = Math.max(0, Math.min(255, data[i+1] + n));
     data[i+2] = Math.max(0, Math.min(255, data[i+2] + n));
  }
  ctx.putImageData(idata, 0, 0);
};

export const HERO_GLYPH: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2;
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
  grad.addColorStop(0, '#818cf8');
  grad.addColorStop(1, '#4338ca');
  
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#c7d2fe'; 
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, 48, 0, Math.PI*2); ctx.stroke();

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
};

export const INDUSTRIAL_CRATE: TextureGenerator = (ctx, w, h) => {
  ctx.fillStyle = '#334155';
  ctx.fillRect(0,0,w,h);
  applyNoise(ctx, w, h, 15);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(4,4,w-8,h-8);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(16, 16, w-32, h-32);
  
  ctx.save();
  ctx.beginPath();
  ctx.rect(20, 20, w-40, h-40);
  ctx.clip();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#ca8a04';
  for(let i=-w; i<w*2; i+=20) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i+10, 0);
      ctx.lineTo(i-10+h, h); ctx.lineTo(i-20+h, h);
      ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(10, 10); ctx.lineTo(w-10, h-10);
  ctx.moveTo(w-10, 10); ctx.lineTo(10, h-10);
  ctx.stroke();
};

export const STRUCTURAL_WALL: TextureGenerator = (ctx, w, h) => {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
  applyNoise(ctx, w, h, 25);
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
  ctx.beginPath(); 
  ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
  ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
  ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.fillRect(10, 10, 30, 10);
  ctx.fillRect(w-40, h-20, 30, 10);
};

export const TOXIC_DRUM: TextureGenerator = (ctx, w, h) => {
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#064e3b');
  grad.addColorStop(0.5, '#065f46');
  grad.addColorStop(1, '#064e3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = '#10b981';
  ctx.fillRect(0, h * 0.2, w, 10);
  ctx.fillRect(0, h * 0.8, w, 10);
  
  // Hazard Icon
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.6);
  ctx.lineTo(w * 0.65, h * 0.6);
  ctx.lineTo(w * 0.5, h * 0.4);
  ctx.closePath();
  ctx.stroke();
};

export const STRUCTURAL_GLASS: TextureGenerator = (ctx, w, h) => {
  ctx.fillStyle = 'rgba(186, 230, 253, 0.2)';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  
  // Shine lines
  ctx.beginPath();
  ctx.moveTo(10, 10); ctx.lineTo(40, 40);
  ctx.moveTo(20, 10); ctx.lineTo(50, 40);
  ctx.stroke();
};

export const KINETIC_PLATFORM: TextureGenerator = (ctx, w, h) => {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);
  
  // Grip pattern
  ctx.fillStyle = '#0f172a';
  for(let i = 0; i < w; i += 8) {
    for(let j = 0; j < h; j += 8) {
      ctx.fillRect(i + 2, j + 2, 4, 4);
    }
  }
  
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, w, h);
};

export const HERO_SPRITE_SHEET: TextureGenerator = (ctx, w, h) => {
  const frameSize = 32;
  const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
  for (let row = 0; row < 4; row++) {
     for (let col = 0; col < 4; col++) {
       const x = col * frameSize;
       const y = row * frameSize;
       ctx.fillStyle = row % 2 === 0 ? '#1e293b' : '#0f172a';
       const cx = x + frameSize / 2;
       const cy = y + frameSize / 2;
       ctx.fillStyle = colors[col];
       ctx.beginPath(); ctx.arc(cx, cy, 10 + (col * 1), 0, Math.PI * 2); ctx.fill();
       ctx.fillStyle = '#fff';
       if (row === 0) ctx.fillRect(cx - 3, cy + 6, 6, 3);
       if (row === 1) ctx.fillRect(cx - 3, cy - 9, 6, 3);
       if (row === 2) ctx.fillRect(cx - 9, cy - 3, 3, 6);
       if (row === 3) ctx.fillRect(cx + 6, cy - 3, 3, 6);
     }
  }
};

// --- SLIME SOCCER ASSETS ---

export const SLIME_AVATAR: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h; 
  // Slime Body (Semi-Circle)
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(cx, cy, w/2 - 4, Math.PI, 0);
  ctx.fill();
  
  // Highlight
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.ellipse(cx - 20, cy - 40, 10, 6, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx + 15, cy - 30, 12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(cx + 18, cy - 30, 5, 0, Math.PI*2); ctx.fill();
};

export const SOCCER_BALL: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2;
  const r = w/2 - 2;
  
  // White Base
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  
  // Pentagons (Approx)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI*2); ctx.fill(); // Center
  
  for(let i=0; i<5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const px = cx + Math.cos(angle) * (r * 0.7);
    const py = cy + Math.sin(angle) * (r * 0.7);
    ctx.beginPath(); ctx.arc(px, py, r * 0.25, 0, Math.PI*2); ctx.fill();
  }
  
  // Outline
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
};

export const SOCCER_GOAL: TextureGenerator = (ctx, w, h) => {
  // Posts
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(4, h); ctx.lineTo(4, 4); ctx.lineTo(w-4, 4); ctx.lineTo(w-4, h);
  ctx.stroke();
  
  // Net
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  for(let i=10; i<w; i+=10) { ctx.moveTo(i, 4); ctx.lineTo(i-5, h); }
  for(let j=10; j<h; j+=10) { ctx.moveTo(4, j); ctx.lineTo(w-4, j); }
  ctx.stroke();
  ctx.globalAlpha = 1.0;
};

export const PROCEDURAL_REGISTRY: Record<string, TextureGenerator> = {
  'tex_hero': HERO_GLYPH,
  'tex_crate': INDUSTRIAL_CRATE,
  'tex_wall': STRUCTURAL_WALL,
  'tex_toxic': TOXIC_DRUM,
  'tex_glass': STRUCTURAL_GLASS,
  'tex_platform': KINETIC_PLATFORM,
  'tex_hero_sheet': HERO_SPRITE_SHEET,
  'tex_slime': SLIME_AVATAR,
  'tex_ball_soccer': SOCCER_BALL,
  'tex_goal': SOCCER_GOAL
};