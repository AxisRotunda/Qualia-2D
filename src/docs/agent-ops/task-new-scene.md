# [OP_01] Task: Add New Scene
Context: Qualia2D Engine | Architecture: ECS + Signals

## 1. TARGET FILES
You need access to ONLY these files to complete this task:
1. `src/data/scenes/[YOUR_SCENE_NAME].ts` (Create New)
2. `src/data/scene-presets.ts` (Register)

## 2. CONSTRAINT CHECKLIST
- [ ] **Topology**: Must define `preferredTopology` ('platformer' | 'top-down-rpg' | 'top-down-action').
- [ ] **Spawning**: Use `engine.spawnBox()` or `engine.factory.spawnPlayer()`.
- [ ] **Reset**: Do NOT call `engine.reset()` manually; the `SceneManager` handles this.
- [ ] **Async**: `load()` is synchronous, but `engine` methods may trigger internal async physics.

## 3. CODE SKELETON (The Fragment)
File: `src/data/scenes/[scene-slug].ts`

```typescript
import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export const MY_NEW_SCENE: ScenePreset2D = {
  id: 'unique_id_here',
  name: 'Human Readable Name',
  description: 'Short description for the UI card.',
  tags: ['Tag1', 'Tag2'],
  complexity: 'low', // 'low' | 'medium' | 'high'
  preferredTopology: 'platformer', // See Constraint Checklist
  
  load: (engine: Engine2DService) => {
    // 1. Set Context
    engine.state.setTopology('platformer');
    
    // 2. Spawn Static World
    // Example: Floor
    engine.spawnBox(0, -5, '#475569', 20, 1, 'fixed');
    
    // 3. Spawn Player
    engine.factory.spawnPlayer(0, 0);
    
    // 4. Spawn Dynamic Elements
    for(let i=0; i<5; i++) {
       engine.spawnBox(i * 2, 5, '#60a5fa', 1, 1, 'dynamic');
    }
  }
};
```

## 4. REGISTRATION STEP
File: `src/data/scene-presets.ts`

```typescript
import { MY_NEW_SCENE } from './scenes/[scene-slug]';

export const SCENES: ScenePreset2D[] = [
  // ... existing scenes
  MY_NEW_SCENE
];
```