/**
 * Obsidian Glass: Procedural Asset Synthesis [DATA LAYER]
 * ID: PROCEDURAL_TEXTURES_V1.1
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

// [PROTOCOL_INDUSTRY] Fantasy Assets
export const FANTASY_TREE: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(cx, h-10, 20, 8, 0, 0, Math.PI*2); ctx.fill();
  
  // Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx-4, h-40, 8, 30);
  
  // Foliage (Triangles)
  ctx.fillStyle = '#059669';
  ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx+25, 50); ctx.lineTo(cx-25, 50); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, 30); ctx.lineTo(cx+30, 80); ctx.lineTo(cx-30, 80); ctx.fill();
};

export const MYSTIC_PORTAL: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2;
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 50);
  grad.addColorStop(0, '#10b981'); // Emerald
  grad.addColorStop(1, '#020617');
  
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, 45, 0, Math.PI*2); ctx.fill();
  
  // Runes
  ctx.strokeStyle = '#6ee7b7';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy-45); ctx.lineTo(cx, cy+45); ctx.stroke();
};

export const NPC_ELDER: TextureGenerator = (ctx, w, h) => {
  ctx.fillStyle = '#f59e0b'; // Amber robes
  ctx.fillRect(w/4, h/3, w/2, h/2);
  ctx.fillStyle = '#fcd34d'; // Face
  ctx.beginPath(); ctx.arc(w/2, h/3, 12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; // Beard
  ctx.beginPath(); ctx.moveTo(w/2 - 10, h/3 + 5); ctx.lineTo(w/2, h/2 + 10); ctx.lineTo(w/2 + 10, h/3 + 5); ctx.fill();
};

export const PROCEDURAL_REGISTRY: Record<string, TextureGenerator> = {
  'tex_hero': HERO_GLYPH,
  'tex_crate': INDUSTRIAL_CRATE,
  'tex_wall': STRUCTURAL_WALL,
  'tex_hero_sheet': HERO_SPRITE_SHEET,
  'tex_tree': FANTASY_TREE,
  'tex_portal': MYSTIC_PORTAL,
  'tex_npc': NPC_ELDER
};