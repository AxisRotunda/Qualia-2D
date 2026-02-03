# [T0] RPG Protocol: Systems & Mechanics
ID: PROTOCOL_RPG_V1.1 | Role: Role-Playing Game Mechanics.

## 1. INTENT
Implement industry-standard RPG features (Sprite Animation, Interaction, Dialog Triggers) within the ECS architecture, ensuring project-level persistence across scene fragments.

## 2. HARD STRUCTURAL DEFINITIONS

### 2.1 ANIMATION SYSTEM (Flipbook)
- **Component**: `SpriteAnimation`.
- **Logic**: Time-based frame advancement. Mutates `Sprite2D.frameX/Y`.
- **Topology**: Primarily active in `top-down-rpg` and `top-down-action`.

### 2.2 INTERACTION SYSTEM (Area2D)
- **Component**: `Interaction`.
- **Input**: Activated via the `Input.action` signal.
- **Boundary**: Proximity check (Radius-based) in world units.

## 3. LOGIC MATRIX: RUN_RPG_SYS

| Step | Action | Description |
| :--- | :--- | :--- |
| 01 | **SCAN** | Identify `Interaction` components within radius of `Player`. |
| 02 | **DIALOG** | If `DialogComponent` present, push to `GameSessionService`. |
| 03 | **PORTAL** | If `PortalComponent` present, trigger `SceneManager.transitionTo`. |
| 04 | **PERSIST** | Update session flags or inventory based on `triggerId`. |

## 4. SKELETAL GUIDELINES (SG)

### Interaction Definition
```typescript
this.ecs.interactions.set(id, { 
  radius: 2.5, 
  label: 'Examine', 
  triggerId: 'item_discovery_01' 
});
```

## 5. SAFEGUARDS
- **Circular Avoidance**: Use `Injector` for lazy resolution of `Engine2DService` within interaction systems.
- **Asset Bounds**: Frame indices must remain within the bounds of the active `SpriteAnimation.config`.
- **Zoneless**: Interaction prompts must only appear if `EngineState.mode === 'play'`.