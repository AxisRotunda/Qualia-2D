
/**
 * Obsidian Glass: Procedural Asset Synthesis [DATA LAYER]
 * ID: PROCEDURAL_TEXTURES_V1.3
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

// --- SLIME SOCCER ASSETS (HARD REALISM) ---

/**
 * [REPAIR]: Slime Avatar redesign.
 * Centered semi-sphere to align with Entity Center.
 */
export const SLIME_AVATAR: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2 + 25; 
  const r = w/2 - 10;
  
  // Gelatinous Body Gradient
  const grad = ctx.createRadialGradient(cx, cy - r/2, 5, cx, cy, r);
  grad.addColorStop(0, '#f472b6'); // Pink-400
  grad.addColorStop(0.7, '#db2777'); // Pink-600
  grad.addColorStop(1, '#9d174d'); // Pink-800
  ctx.fillStyle = grad;
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.fill();
  
  // Glassy Rim Highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, Math.PI + 0.2, -0.2);
  ctx.stroke();

  // Internal Depth (Shadow)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 5, r * 0.8, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // The All-Seeing Eye (Cyclops)
  const eyeX = cx, eyeY = cy - r/2 - 5;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(eyeX, eyeY, 18, 0, Math.PI*2); ctx.fill();
  
  // Iris Depth
  const irisGrad = ctx.createRadialGradient(eyeX, eyeY, 2, eyeX, eyeY, 10);
  irisGrad.addColorStop(0, '#000');
  irisGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = irisGrad;
  ctx.beginPath(); ctx.arc(eyeX + 2, eyeY, 8, 0, Math.PI*2); ctx.fill();
  
  // Specular Reflection
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(eyeX - 4, eyeY - 4, 3, 0, Math.PI*2); ctx.fill();
};

export const SOCCER_BALL: TextureGenerator = (ctx, w, h) => {
  const cx = w/2, cy = h/2;
  const r = w/2 - 2;
  
  // Realistic Spherical Shading
  const grad = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.1, cx, cy, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.8, '#cbd5e1');
  grad.addColorStop(1, '#64748b');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  
  // Classic Hex Pattern
  ctx.fillStyle = '#0f172a';
  ctx.globalAlpha = 0.9;
  
  // Central Hex
  const drawHex = (hx: number, hy: number, size: number) => {
    ctx.beginPath(); 
    for(let i=0; i<6; i++) {
        const a = i * Math.PI / 3;
        const px = hx + Math.cos(a) * size;
        const py = hy + Math.sin(a) * size;
        if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.fill();
  };

  drawHex(cx, cy, r * 0.35);
  
  // Perimeter Hexes
  for(let i=0; i<5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI/2;
    drawHex(cx + Math.cos(angle) * r * 0.7, cy + Math.sin(angle) * r * 0.7, r * 0.3);
  }
  
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
};

export const SOCCER_GOAL: TextureGenerator = (ctx, w, h) => {
  // Metallic Posts
  const postGrad = ctx.createLinearGradient(0, 0, w, 0);
  postGrad.addColorStop(0, '#94a3b8');
  postGrad.addColorStop(0.5, '#f8fafc');
  postGrad.addColorStop(1, '#94a3b8');
  
  ctx.strokeStyle = postGrad;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(8, h); ctx.lineTo(8, 8); ctx.lineTo(w-8, 8); ctx.lineTo(w-8, h);
  ctx.stroke();
  
  // Netting
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(let i=12; i<w-8; i+=12) { ctx.moveTo(i, 8); ctx.lineTo(i, h); }
  for(let j=16; j<h; j+=12) { ctx.moveTo(8, j); ctx.lineTo(w-8, j); }
  ctx.stroke();
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
