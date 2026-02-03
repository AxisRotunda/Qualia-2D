/**
 * Obsidian Glass: Visual Configuration Registry
 * ID: VISUAL_CONFIG_V1.0
 */
export const VISUAL_CONFIG = {
  // Rendering Limits
  MAX_ENTITIES_PER_BATCH: 1000,
  DEFAULT_LAYER_COUNT: 5,
  
  // Layer Mapping
  LAYERS: {
    BACKGROUND: 0,
    STATIC: 1,
    DYNAMIC: 2,
    VFX: 3,
    UI_OVERLAY: 4
  },

  // Sprite Sheet Constants
  SPRITE_SHEET: {
    FRAME_SIZE: 32,
    SHEET_SIZE: 128,
    GRID_COLS: 4,
    GRID_ROWS: 4
  },

  // Grid Properties
  GRID: {
    SIZE: 1,
    THICKNESS: 1,
    COLORS: {
      MINOR: '#1e293b',
      X_AXIS: '#ef444466',
      Y_AXIS: '#22c55e66'
    }
  },

  // Interaction Visuals
  HIGHLIGHT: {
    PULSE_SPEED: 12,
    GLOW_STRENGTH: 0.5,
    COLORS: {
      IDLE: '#3b82f6',
      DRAGGING: '#60a5fa',
      INNER: '#ffffff'
    }
  }
};
