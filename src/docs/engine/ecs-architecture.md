# [T1] ECS Architecture: Single Source of Truth
ID: ENGINE_ECS_V1.1 | Role: Data Governance.

## 1. THE ARCHITECTURE
Qualia2D utilizes a high-performance Registry-backed ECS. Data is stored in flat Maps keyed by `EntityId`, ensuring cache-friendly access and clear separation of state from logic.

## 2. COMPONENT REGISTRY

### [D0] PHYSICAL COMPONENTS
| Component | Store | Responsibility |
| :--- | :--- | :--- |
| `Transform2D` | `transforms` | Spatial state (X, Y, Rotation). |
| `RigidBody2D` | `rigidBodies` | Physics state (WASM Handle). |
| `Collider2D` | `colliders` | Collision hull (WASM Handle). |

### [D1] NARRATIVE & RPG COMPONENTS
| Component | Store | Responsibility |
| :--- | :--- | :--- |
| `Interaction` | `interactions` | Proximity-based action triggers. |
| `DialogComponent`| `dialogs` | NPC speech and narrative data. |
| `PortalComponent`| `portals` | Scene-to-scene transition markers. |
| `SpriteAnimation`| `animations` | Flipbook state for animated sprites. |

## 3. LIFECYCLE MANAGEMENT
Governed by `ComponentStoreService`:
1. **ADD**: `addEntity(id)` registers the ID in the master list.
2. **CLEANUP**: `removeEntity(id)` iterates all registries to purge components.
3. **RESET**: `clear()` flushes all registries (except persistent session state).

## 4. SAFEGUARDS
- **Dangling Handles**: Removing a `RigidBody2D` must also remove its WASM collider.
- **Signal Integrity**: Map mutations do NOT trigger CD; only master list signals emit.