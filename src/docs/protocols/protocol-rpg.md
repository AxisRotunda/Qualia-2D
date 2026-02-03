# [T0] RPG Protocol: Systems & Mechanics
ID: PROTOCOL_RPG_V1.0 | Role: Role-Playing Game Mechanics.

## 1. INTENT
To implement industry-standard RPG features (Sprite Animation, Interaction, Dialog Triggers) within the ECS architecture, approximating the capabilities of engines like Godot for 2D top-down games.

## 2. HARD STRUCTURAL DEFINITIONS

### 2.1 ANIMATION SYSTEM (Flipbook)
- **Component**: `SpriteAnimation`.
- **Logic**: Time-based frame advancement. Mutates `Sprite2D.frameX/Y`.
- **State Machine**: Supports `idle`, `walk`, `run` states mapped to Sprite Sheet rows.

### 2.2 INTERACTION SYSTEM (Area2D)
- **Component**: `Interaction`.
- **Logic**: Proximity check against the Player entity.
- **Trigger**: Activated via the `Input.action` signal (Spacebar / Button A).

## 3. COMPONENT SCHEMAS

### SpriteAnimation
```typescript
interface SpriteAnimation {
  active: boolean;
  state: string; // 'idle', 'walk'
  facing: 'down' | 'up' | 'left' | 'right';
  timer: number;
  frameIndex: number;
  config: Map<string, { row: number, count: number, speed: number }>;
}
```

### Interaction
```typescript
interface Interaction {
  radius: number;
  label: string;
  triggerId: string; // Event ID for the command system
}
```

## 4. LOGIC MATRIX: RUN_RPG_SYS

| Step | System | Action |
| :--- | :--- | :--- |
| 01 | **INPUT** | Capture `Action` intent (Space/Touch). |
| 02 | **INTERACT** | Query `Interaction` components within radius of Player. |
| 03 | **ANIMATE** | Update `frameIndex` based on `dt`. Update `facing` based on `RigidBody` velocity. |
| 04 | **RENDER** | Draw sub-rect of texture based on `frameX/Y` and `frameWidth/Height`. |

## 5. SAFEGUARDS
- **Asset Bounds**: Ensure `frameIndex` never exceeds `count` to prevent "flickering" or blank rendering.
- **Topology Check**: Interaction UI should only appear in `top-down-rpg` mode.