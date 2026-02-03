# [T0] Spawning Protocol
ID: PROTOCOL_SPAWNING_V1.0 | Role: Entity Lifecycle Governance.

## 1. INTENT
Govern the instantiation of entities from templates and blueprints. This ensures a clear separation between "What" an entity is (Factory) and "Where/How" it is placed (Spawner).

## 2. CONTEXTUAL ANCHORS
- **Governs**: `src/engine/factory/entity-factory.service.ts`, `src/services/spawner-2d.service.ts`.
- **Data Source**: `src/data/prefabs/entity-blueprints.ts`.

## 3. HARD STRUCTURAL DEFINITIONS (HSD)

### 3.1 THE FACTORY (THE 'WHAT')
- Responsibility: Component attachment and default initialization.
- Constraint: Must NOT have knowledge of the camera or UI state.

### 3.2 THE SPAWNER (THE 'HOW')
- Responsibility: Spatial positioning, coordinate projection, and orchestration.
- Constraint: Bridges the UI/Camera context to the Factory.

## 4. LOGIC MATRIX: RUN_SPAWN [TEMPLATE_ID]

1. **Resolve**: Check `entity-blueprints.ts` for valid template mapping.
2. **Project**: If spawning "At Camera", calculate world coordinates using `CameraService.screenToWorld`.
3. **Instantiate**: Invoke `EntityFactoryService` to attach components.
4. **Register**: The Factory must register the `EntityId` with `ComponentStoreService`.
5. **Physics**: The Factory must invoke `PhysicsEngine` to create bodies/colliders.

## 5. SKELETAL GUIDELINES (SG)
```typescript
// Standard Spawning Pattern
const id = this.factory.spawnPlayer(x, y);
this.ecs.tags.set(id, { name: 'New_Entity', tags: new Set(['active']) });
```

## 6. SAFEGUARDS
- **Finite Guard**: All spawn coordinates must be verified finite.
- **ID Uniqueness**: Must use `EntityGenerator` to ensure zero ID collisions.
