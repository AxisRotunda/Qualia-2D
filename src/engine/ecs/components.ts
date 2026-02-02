export interface Transform2D {
  x: number;
  y: number;
  rotation: number; // Radians
  scaleX: number;
  scaleY: number;
}

export interface Sprite2D {
  color: string; // Placeholder for actual sprite ID/Atlas
  width: number;
  height: number;
  layer: number;
  opacity: number;
}

export interface RigidBody2D {
  handle: any; // RAPIER.RigidBody (using any to avoid strict type dependency issues in this setup)
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
