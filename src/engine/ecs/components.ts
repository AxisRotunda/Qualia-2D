// src/engine/ecs/components.ts

// Validation Constants
export const TRANSFORM_LIMITS = {
  MIN_SCALE: 0.01,
  MAX_SCALE: 100,
  MAX_COORDINATE: 1e6
} as const;

export const SPRITE_LIMITS = {
  MIN_SIZE: 0.01,
  MAX_SIZE: 1000,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  MIN_LAYER: 0,
  MAX_LAYER: 10
} as const;

export const PHYSICS_LIMITS = {
  MIN_MASS: 0.01,
  MAX_MASS: 1e6,
  MIN_DAMPING: 0,
  MAX_DAMPING: 1,
  MIN_RESTITUTION: 0,
  MAX_RESTITUTION: 1,
  MIN_FRICTION: 0
} as const;

// Type Utilities
export type BodyType = 'dynamic' | 'fixed' | 'kinematic';
export type ColliderShape = 'cuboid' | 'ball';
export type AnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'fall';
export type FacingDirection = 'down' | 'up' | 'left' | 'right';

/**
 * Core spatial component with temporal smoothing support.
 */
export interface Transform2D {
  x: number;
  y: number;
  rotation: number; // Radians
  scaleX: number;
  scaleY: number;
  
  // [RUN_REF]: Temporal state for interpolation
  prevX: number;
  prevY: number;
  prevRotation: number;
}

/**
 * Visual rendering component with sprite sheet support.
 */
export interface Sprite2D {
  color: string;
  textureId?: string;
  width: number;
  height: number;
  layer: number;
  opacity: number;
  flipX?: boolean;
  flipY?: boolean;
  
  // Sprite Sheet Support
  frameX?: number;
  frameY?: number;
  frameWidth?: number;
  frameHeight?: number;
}

/**
 * Physics body component (Rapier integration).
 */
export interface RigidBody2D {
  handle: any; // RAPIER.RigidBody
  bodyType: BodyType;
}

/**
 * Collision shape component (Rapier integration).
 */
export interface Collider2D {
  handle: any; // RAPIER.Collider
  shape: ColliderShape;
}

/**
 * Entity identification and categorization.
 */
export interface TagComponent {
  name: string;
  tags: Set<string>;
}

/**
 * Radial force field component for attraction/repulsion.
 */
export interface ForceField2D {
  strength: number; // Positive = Attract, Negative = Repel
  radius: number;
  active: boolean;
}

/**
 * Player controller data component.
 */
export interface PlayerController2D {
  speed: number;
  turnSpeed: number;
  lastFireTime: number;
  fireRate: number; // ms between shots
}

/**
 * Sprite animation state machine component.
 */
export interface SpriteAnimation {
  active: boolean;
  state: string; // Use AnimationState for strict typing in specific contexts
  facing: FacingDirection;
  timer: number;
  frameIndex: number;
  
  // Config: State -> { row, count, speed }
  config: Map<string, { row: number; count: number; speed: number }>;
}

/**
 * Interaction zone component for proximity-based events.
 */
export interface Interaction {
  radius: number;
  label: string;
  triggerId: string;
}

/**
 * Dialog/conversation component.
 */
export interface DialogComponent {
  speaker: string;
  text: string;
}

/**
 * Scene transition portal component.
 */
export interface PortalComponent {
  targetSceneId: string;
  spawnX: number;
  spawnY: number;
}

// Component Validation Utilities
export function isValidTransform(t: Partial<Transform2D>): t is Transform2D {
  return (
    typeof t.x === 'number' && Number.isFinite(t.x) &&
    typeof t.y === 'number' && Number.isFinite(t.y) &&
    typeof t.rotation === 'number' && Number.isFinite(t.rotation) &&
    typeof t.scaleX === 'number' && t.scaleX > 0 &&
    typeof t.scaleY === 'number' && t.scaleY > 0
  );
}

export function isValidSprite(s: Partial<Sprite2D>): s is Sprite2D {
  return (
    typeof s.color === 'string' &&
    typeof s.width === 'number' && s.width > 0 &&
    typeof s.height === 'number' && s.height > 0 &&
    typeof s.layer === 'number' && Number.isInteger(s.layer) &&
    typeof s.opacity === 'number' && s.opacity >= 0 && s.opacity <= 1
  );
}

// Component Factory Helpers
export function createDefaultTransform(x = 0, y = 0): Transform2D {
  return {
    x, y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    prevX: x,
    prevY: y,
    prevRotation: 0
  };
}

export function createDefaultSprite(width = 1, height = 1, color = '#ffffff'): Sprite2D {
  return {
    color,
    width,
    height,
    layer: 1,
    opacity: 1
  };
}

export function clampTransformScale(scale: number): number {
  return Math.max(
    TRANSFORM_LIMITS.MIN_SCALE,
    Math.min(TRANSFORM_LIMITS.MAX_SCALE, scale)
  );
}

export function clampSpriteOpacity(opacity: number): number {
  return Math.max(
    SPRITE_LIMITS.MIN_OPACITY,
    Math.min(SPRITE_LIMITS.MAX_OPACITY, opacity)
  );
}
