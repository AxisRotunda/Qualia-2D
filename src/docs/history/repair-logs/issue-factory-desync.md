# Issue Log: Factory Method Desync
ID: REPAIR_FACTORY_01 | Status: RESOLVED

## 1. OBSERVATION
The "Kinetic Chaos" stress test scene failed to load with the error: `engine.factory.spawnGravityWell is not a function`. This occurred because the scene logic migrated to use a specialized factory method while the `EntityFactoryService` implementation only supported generic blueprint assembly.

## 2. HYPOTHESIS
The `EntityFactoryService` was refactored to prioritize blueprint assembly (`spawnFromTemplate`) but missed the specialized manual assembly method for `spawnGravityWell` required by procedural scenes that override default strength/radius parameters.

## 3. ATTEMPTS
- **Attempt 01**: Manually added `spawnGravityWell` to the factory.
- **Attempt 02**: Verified visual encoding (Indigo for attraction, Rose for repulsion).
- **Attempt 03**: Ensured sensor-type collision to prevent physical blockages by the gravity nodes themselves.

## 4. FINAL RESOLUTION
- Implemented `spawnGravityWell(x, y, strength, radius)` in `EntityFactoryService`.
- Logic correctly initializes `ForceField2D` component and attaches a sensor-mode cuboid collider for spatial picking.
- Successfully verified scene `kinetic-chaos` now initializes with 3 active gravity wells.