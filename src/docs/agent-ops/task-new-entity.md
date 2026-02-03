# [OP_02] Task: Add New Entity
Context: Qualia2D Engine | Architecture: ECS + Signals

## 1. TARGET FILES
You need access to ONLY these files to complete this task:
1. `src/engine/factory/entity-factory.service.ts` (Implementation)
2. `src/data/prefabs/entity-blueprints.ts` (UI Registry)

## 2. CONSTRAINT CHECKLIST
- [ ] **ECS**: Must generate ID, add to `ecs`, and set `Transform`, `Sprite`, `RigidBody`.
- [ ] **Physics**: Use `physics.createBody` and `physics.createCollider`.
- [ ] **Tags**: Always add a `TagComponent` for hierarchy visibility.

## 3. CODE SKELETON (Factory Method)
File: `src/engine/factory/entity-factory.service.ts`

```typescript
// Add inside EntityFactoryService class
spawnMyEntity(x: number, y: number): EntityId {
  const id = EntityGenerator.generate();
  this.ecs.addEntity(id);
  
  // 1. Core Components
  this.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
  this.ecs.sprites.set(id, { color: '#ff00ff', width: 1, height: 1, layer: 1, opacity: 1 });
  this.ecs.tags.set(id, { name: `MyEntity_${id}`, tags: new Set(['custom_tag']) });
  
  // 2. Physics (Optional)
  const rb = this.physics.createBody(id, 'dynamic', x, y);
  if (rb) {
    this.physics.createCollider(id, rb, 1, 1);
  }
  
  return id;
}

// Update spawnFromTemplate switch case
spawnFromTemplate(templateId: string, x = 0, y = 0): EntityId {
  switch(templateId) {
    // ... existing
    case 'my_entity_id': return this.spawnMyEntity(x, y);
    // ...
  }
}
```

## 4. REGISTRATION STEP (UI Blueprint)
File: `src/data/prefabs/entity-blueprints.ts`

```typescript
export const ENTITY_TEMPLATES: EntityTemplate[] = [
  // ... existing
  { 
    id: 'my_entity_id', 
    name: 'My New Entity', 
    category: 'dynamic', 
    icon: 'SVG_PATH_DATA' 
  }
];
```