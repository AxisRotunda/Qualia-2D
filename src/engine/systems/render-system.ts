import { Injectable, inject } from '@angular/core';
import { ComponentStoreService } from '../ecs/component-store.service';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Camera2DService } from '../../services/camera-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { AssetRegistryService } from '../core/asset-registry.service';
import { PhysicsEngine } from '../core/physics-engine.service';

// Render System Configuration
const RENDER_CONFIG = {
  CANVAS: {
    ALPHA: false,
    DESYNCHRONIZED: true,
  },
  CULLING: {
    FRUSTUM_PADDING: 2, // Extra units around frustum for smooth culling
  },
  VISUAL_EFFECTS: {
    FORCE_FIELD: {
      BASE_OPACITY: 0.2,
      PULSE_AMPLITUDE: 0.1,
      PULSE_FREQUENCY: 4,
      ATTRACT_COLOR: '#6366f1',
      REPEL_COLOR: '#f43f5e',
    },
    SELECTION: {
      BASE_OPACITY: 0.6,
      PULSE_FREQUENCY: 10,
      PULSE_MIN: 0.9,
      NORMAL_LINE_WIDTH: 3,
      DRAGGING_LINE_WIDTH: 6,
      NORMAL_COLOR: '#ffffff',
      DRAGGING_COLOR: '#60a5fa',
      RECT_PADDING: 0.05,
      RECT_EXPANSION: 0.1,
    },
    DRAG_LINE: {
      DASH_PATTERN: [0.1, 0.1],
      LINE_WIDTH: 1.5,
      COLOR: '#60a5fa',
    },
  },
  MORTON: {
    COORDINATE_OFFSET: 1024,
    COORDINATE_SCALE: 10,
    BITMASK_16: 0xFFFF,
    INTERLEAVE_MASKS: {
      MASK_1: 0x00FF00FF,
      MASK_2: 0x0F0F0F0F,
      MASK_3: 0x33333333,
      MASK_4: 0x55555555,
    },
  },
  GRID: {
    DEFAULT_OPACITY: 0.05,
    LINE_WIDTH: 1,
    COLOR: '#ffffff',
  },
  SPRITE: {
    SHEET_IDENTIFIER: 'sheet', // Texture IDs containing this are treated as sprite sheets
  },
} as const;

/**
 * Obsidian Glass: Render System V6.0 (Singularity)
 * [OPTIMIZATION]: Zero-allocation buffer reuse, Morton-order spatial sorting
 * [REALISM]: Physics-interpolated rendering with alpha blending
 * [PERFORMANCE]: Frustum culling, cached gradients, stratified rendering
 * 
 * Rendering Pipeline:
 * 1. Background & Grid
 * 2. Frustum Culling & Spatial Sorting (Morton curve)
 * 3. Interpolated Entity Rendering (alpha-blended physics steps)
 * 4. Overlay Effects (force fields, selection indicators)
 */
@Injectable({ providedIn: 'root' })
export class RenderSystem {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  public width = 0;
  public height = 0;

  private readonly store = inject(ComponentStoreService);
  private readonly state = inject(EngineState2DService);
  private readonly camera = inject(Camera2DService);
  private readonly input = inject(Input2DService);
  private readonly assets = inject(AssetRegistryService);
  private readonly physics = inject(PhysicsEngine);

  // Performance: Reusable buffers to avoid allocations
  private readonly renderBuffer: number[] = [];
  private cachedGradient: CanvasGradient | null = null;
  private lastEnvHash: string = '';

  /**
   * Attaches render system to canvas element
   */
  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { 
      alpha: RENDER_CONFIG.CANVAS.ALPHA, 
      desynchronized: RENDER_CONFIG.CANVAS.DESYNCHRONIZED 
    });
    this.resize();
  }

  /**
   * Resizes canvas to match parent container
   */
  resize(): void {
    if (!this.canvas) return;
    
    const parent = this.canvas.parentElement;
    if (!parent) return;

    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Invalidate cached gradient on resize
    this.cachedGradient = null;
  }

  /**
   * Main render loop - executes every frame
   */
  render(): void {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    const alpha = this.physics.interpolationAlpha();
    
    const camX = this.camera.x();
    const camY = this.camera.y();
    const zoom = this.camera.zoom();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Phase 1: Background & Grid
    this.drawBackground(ctx);
    if (this.state.gridVisible()) {
      this.drawGrid(ctx, camX, camY, zoom, halfW, halfH);
    }

    // Phase 2: World Space Transformation
    ctx.save();
    ctx.translate(halfW, halfH);
    ctx.scale(zoom, -zoom); // Flip Y-axis for world coordinates
    ctx.translate(-camX, -camY);

    // Phase 3: Frustum Culling & Spatial Sorting
    const frustumW = this.width / zoom;
    const frustumH = this.height / zoom;
    this.prepareRenderBuffer(camX, camY, frustumW, frustumH);

    // Phase 4: Entity Rendering (Stratified by layer, then Morton-sorted)
    for (let i = 0; i < this.renderBuffer.length; i++) {
      this.renderEntity(ctx, this.renderBuffer[i], alpha, time, zoom);
    }

    // Phase 5: Overlay Effects
    this.drawOverlays(ctx, zoom);

    ctx.restore();
  }

  /**
   * Prepares render buffer with frustum-culled entities, sorted by layer and Morton code
   * Morton ordering improves CPU cache coherence for spatially adjacent entities [web:15][web:19]
   */
  private prepareRenderBuffer(cx: number, cy: number, fw: number, fh: number): void {
    const entities = this.store.entitiesList();
    const padding = RENDER_CONFIG.CULLING.FRUSTUM_PADDING;
    
    const minX = cx - fw / 2 - padding;
    const maxX = cx + fw / 2 + padding;
    const minY = cy - fh / 2 - padding;
    const maxY = cy + fh / 2 + padding;

    // Clear buffer without reallocation
    this.renderBuffer.length = 0;
    
    // Frustum culling pass
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      const t = this.store.getTransform(id);
      
      if (t && t.x > minX && t.x < maxX && t.y > minY && t.y < maxY) {
        this.renderBuffer.push(id);
      }
    }

    // Spatial sorting: Layer-first, then Morton code for cache coherence
    this.renderBuffer.sort((a, b) => {
      const sA = this.store.getSprite(a);
      const sB = this.store.getSprite(b);
      const layerA = sA?.layer ?? 0;
      const layerB = sB?.layer ?? 0;
      
      // Primary sort: Layer (for correct rendering order)
      if (layerA !== layerB) return layerA - layerB;
      
      // Secondary sort: Morton code (for CPU cache optimization)
      const tA = this.store.getTransform(a)!;
      const tB = this.store.getTransform(b)!;
      return this.computeMortonCode(tA.x, tA.y) - this.computeMortonCode(tB.x, tB.y);
    });
  }

  /**
   * Renders a single entity with physics interpolation
   * @param alpha - Interpolation factor between physics steps (0-1)
   */
  private renderEntity(
    ctx: CanvasRenderingContext2D, 
    id: number, 
    alpha: number, 
    time: number, 
    zoom: number
  ): void {
    const t = this.store.getTransform(id);
    const s = this.store.getSprite(id);
    if (!t || !s) return;

    // Physics interpolation for smooth sub-frame rendering
    const rx = t.prevX + (t.x - t.prevX) * alpha;
    const ry = t.prevY + (t.y - t.prevY) * alpha;
    const rr = t.prevRotation + (t.rotation - t.prevRotation) * alpha;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(rr);
    
    // Apply sprite flipping
    if (s.flipX) ctx.scale(-1, 1);
    if (s.flipY) ctx.scale(1, -1);

    ctx.globalAlpha = s.opacity;
    
    // Texture rendering with sprite sheet support
    const texture = s.textureId ? this.assets.getTexture(s.textureId) : null;
    
    if (texture) {
      this.renderTexturedSprite(ctx, s, texture);
    } else {
      // Fallback: Colored rectangle
      ctx.fillStyle = s.color;
      ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
    }

    // Overlay effects
    if (this.store.forceFields.has(id)) {
      this.drawForceField(ctx, id, time, zoom);
    }
    
    if (this.state.selectedEntityId() === id) {
      this.drawSelection(ctx, s, time, zoom);
    }

    ctx.restore();
  }

  /**
   * Renders textured sprite with optional sprite sheet frame extraction
   */
  private renderTexturedSprite(
    ctx: CanvasRenderingContext2D, 
    sprite: any, 
    texture: HTMLImageElement
  ): void {
    const isSpriteSheet = sprite.textureId?.includes(RENDER_CONFIG.SPRITE.SHEET_IDENTIFIER);
    
    if (isSpriteSheet && sprite.frameWidth && sprite.frameHeight) {
      // Sprite sheet rendering: Extract specific frame
      ctx.drawImage(
        texture,
        sprite.frameX || 0,
        sprite.frameY || 0,
        sprite.frameWidth,
        sprite.frameHeight,
        -sprite.width / 2,
        -sprite.height / 2,
        sprite.width,
        sprite.height
      );
    } else {
      // Full texture rendering
      ctx.drawImage(
        texture,
        -sprite.width / 2,
        -sprite.height / 2,
        sprite.width,
        sprite.height
      );
    }
  }

  /**
   * Draws background with optional gradient (cached for performance)
   */
  private drawBackground(ctx: CanvasRenderingContext2D): void {
    const env = this.state.envConfig();
    
    if (env.type === 'atmosphere' && env.horizon) {
      // Cache gradient to avoid recreation every frame
      const hash = `${env.background}-${env.horizon}-${this.height}`;
      
      if (hash !== this.lastEnvHash || !this.cachedGradient) {
        this.cachedGradient = ctx.createLinearGradient(0, 0, 0, this.height);
        this.cachedGradient.addColorStop(0, env.background);
        this.cachedGradient.addColorStop(1, env.horizon);
        this.lastEnvHash = hash;
      }
      
      ctx.fillStyle = this.cachedGradient;
    } else {
      ctx.fillStyle = env.background;
    }
    
    ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Draws grid overlay for spatial reference
   */
  private drawGrid(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    zoom: number,
    halfW: number,
    halfH: number
  ): void {
    ctx.save();
    ctx.strokeStyle = RENDER_CONFIG.GRID.COLOR;
    ctx.lineWidth = RENDER_CONFIG.GRID.LINE_WIDTH;
    ctx.globalAlpha = this.state.envConfig().gridOpacity ?? RENDER_CONFIG.GRID.DEFAULT_OPACITY;
    
    const step = zoom;
    const ox = (-camX * zoom + halfW) % step;
    const oy = (camY * zoom + halfH) % step;
    
    ctx.beginPath();
    
    // Vertical lines
    for (let x = ox; x < this.width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    
    // Horizontal lines
    for (let y = oy; y < this.height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws force field visual indicator
   */
  private drawForceField(
    ctx: CanvasRenderingContext2D,
    id: number,
    time: number,
    zoom: number
  ): void {
    const field = this.store.forceFields.get(id);
    if (!field?.active) return;
    
    const config = RENDER_CONFIG.VISUAL_EFFECTS.FORCE_FIELD;
    const isAttractor = field.strength > 0;
    
    ctx.strokeStyle = isAttractor ? config.ATTRACT_COLOR : config.REPEL_COLOR;
    ctx.lineWidth = 2 / zoom;
    ctx.globalAlpha = config.BASE_OPACITY + Math.sin(time * config.PULSE_FREQUENCY) * config.PULSE_AMPLITUDE;
    
    ctx.beginPath();
    ctx.arc(0, 0, field.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Draws selection indicator around selected entity
   */
  private drawSelection(
    ctx: CanvasRenderingContext2D,
    sprite: any,
    time: number,
    zoom: number
  ): void {
    const config = RENDER_CONFIG.VISUAL_EFFECTS.SELECTION;
    const isDragging = this.input.isDragging();
    
    const pulse = Math.sin(time * config.PULSE_FREQUENCY) * (1 - config.PULSE_MIN) + config.PULSE_MIN;
    
    ctx.strokeStyle = isDragging ? config.DRAGGING_COLOR : config.NORMAL_COLOR;
    ctx.lineWidth = (isDragging ? config.DRAGGING_LINE_WIDTH : config.NORMAL_LINE_WIDTH) / zoom;
    ctx.globalAlpha = pulse * config.BASE_OPACITY;
    
    ctx.strokeRect(
      -sprite.width / 2 - config.RECT_PADDING,
      -sprite.height / 2 - config.RECT_PADDING,
      sprite.width + config.RECT_EXPANSION,
      sprite.height + config.RECT_EXPANSION
    );
  }

  /**
   * Draws overlay effects (drag indicators, etc.)
   */
  private drawOverlays(ctx: CanvasRenderingContext2D, zoom: number): void {
    const selectedId = this.state.selectedEntityId();
    
    if (selectedId && this.input.isDragging() && this.state.mode() === 'play') {
      const t = this.store.getTransform(selectedId);
      const target = this.input.dragTargetPos();
      
      if (t && target) {
        const config = RENDER_CONFIG.VISUAL_EFFECTS.DRAG_LINE;
        
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = config.COLOR;
        ctx.lineWidth = config.LINE_WIDTH / zoom;
        ctx.setLineDash(config.DASH_PATTERN);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash pattern
      }
    }
  }

  /**
   * Computes Morton code (Z-order curve) for spatial sorting
   * Maps 2D coordinates to 1D curve for improved CPU cache locality [web:16][web:19]
   * 
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @returns Morton code (interleaved bit representation)
   */
  private computeMortonCode(x: number, y: number): number {
    const config = RENDER_CONFIG.MORTON;
    
    // Normalize coordinates to positive integer space
    let ix = Math.floor((x + config.COORDINATE_OFFSET) * config.COORDINATE_SCALE) & config.BITMASK_16;
    let iy = Math.floor((y + config.COORDINATE_OFFSET) * config.COORDINATE_SCALE) & config.BITMASK_16;
    
    // Interleave bits using magic number technique for performance
    const interleave = (val: number): number => {
      const masks = config.INTERLEAVE_MASKS;
      val = (val | (val << 8)) & masks.MASK_1;
      val = (val | (val << 4)) & masks.MASK_2;
      val = (val | (val << 2)) & masks.MASK_3;
      val = (val | (val << 1)) & masks.MASK_4;
      return val;
    };
    
    // Combine interleaved X and Y coordinates
    return interleave(ix) | (interleave(iy) << 1);
  }
}
