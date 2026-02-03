
export interface Transform2D {
  x: number;
  y: number;
  rotation: number; // Radians
  scaleX: number;
  scaleY: number;
}

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

export interface RigidBody2D {
  handle: any; // RAPIER.RigidBody
  bodyType: 'dynamic' | 'fixed' | 'kinematic';
}

export interface Collider2D {
  handle: any; // RAPIER.Collider
  shape: 'cuboid' | 'ball';
}

export interface TagComponent {
  name: string;
  tags: Set<string>;
}

export interface ForceField2D {
  strength: number; // Positive = Attract, Negative = Repel
  radius: number;
  active: boolean;
}

export interface PlayerController2D {
  speed: number;
  turnSpeed: number;
  lastFireTime: number;
  fireRate: number; // ms between shots
}

export interface SpriteAnimation {
  active: boolean;
  state: string; // 'idle', 'walk'
  facing: 'down' | 'up' | 'left' | 'right';
  timer: number;
  frameIndex: number;
  // Config: State -> { row, count, speed }
  config: Map<string, { row: number, count: number, speed: number }>;
}

export interface Interaction {
  radius: number;
  label: string;
  triggerId: string;
}