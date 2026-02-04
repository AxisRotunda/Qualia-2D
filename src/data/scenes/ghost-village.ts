import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

// Village Configuration
const VILLAGE_CONFIG = {
  FOREST: {
    TREE_COUNT: 40,
    MIN_RADIUS: 25,
    MAX_RADIUS: 35,
    TREE_SIZE: { width: 2, height: 3 },
    COLLIDER_SIZE: 0.5,
  },
  ELDER: {
    POSITION: { x: 5, y: 5 },
    SIZE: { width: 1.5, height: 1.5 },
    INTERACTION_RADIUS: 2.5,
    COLLIDER_SIZE: 1,
  },
  PORTAL: {
    POSITION: { x: 0, y: 15 },
    SIZE: { width: 4, height: 4 },
    INTERACTION_RADIUS: 2.0,
    FORCE_STRENGTH: -5,
    FORCE_RADIUS: 4,
  },
} as const;

const COLORS = {
  TREE: '#064e3b',
  ELDER: '#fbbf24',
  PORTAL: '#10b981',
} as const;

const TEXTURES = {
  TREE: 'tex_tree',
  NPC: 'tex_npc',
  PORTAL: 'tex_portal',
} as const;

/**
 * GHOST_VILLAGE Scene Preset
 * RPG Project Hub featuring narrative interactions and scene transitions.
 * [PROTOCOL_INDUSTRY] Demonstrates:
 * - Persistent game state connections (Portal system)
 * - Narrative interaction system (Dialog)
 * - Procedural environment generation (Forest boundary)
 */
export const GHOST_VILLAGE: ScenePreset2D = {
  id: 'rpg_demo',
  name: 'Ghost Village',
  description: 'RPG Project Hub. Explore the village, talk to the Elder, and enter the dungeon.',
  tags: ['RPG', 'Project_Hub', 'Narrative'],
  complexity: 'medium',
  preferredTopology: 'top-down-rpg',
  
  load: (engine: Engine2DService) => {
    engine.state.setTopology('top-down-rpg');
    
    // === Player Spawn ===
    engine.factory.spawnPlayer(0, 0);

    // === Environment: Procedural Forest Boundary ===
    spawnForestBoundary(engine);

    // === NPCs: The Elder ===
    spawnElder(engine);

    // === Portal: Dungeon Entrance ===
    spawnDungeonPortal(engine);
  }
};

/**
 * Generates a circular forest boundary using procedural placement
 */
function spawnForestBoundary(engine: Engine2DService): void {
  const { TREE_COUNT, MIN_RADIUS, MAX_RADIUS, TREE_SIZE, COLLIDER_SIZE } = VILLAGE_CONFIG.FOREST;
  
  for (let i = 0; i < TREE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const id = EntityGenerator.generate();
    engine.ecs.addEntity(id);
    
    engine.ecs.transforms.set(id, { 
      x, 
      y, 
      rotation: 0, 
      scaleX: 1, 
      scaleY: 1, 
      prevX: x, 
      prevY: y, 
      prevRotation: 0 
    });
    
    engine.ecs.sprites.set(id, { 
      color: COLORS.TREE, 
      textureId: TEXTURES.TREE, 
      width: TREE_SIZE.width, 
      height: TREE_SIZE.height, 
      layer: 2, 
      opacity: 1 
    });
    
    engine.ecs.rigidBodies.set(id, { 
      handle: engine.physics.createBody(id, 'fixed', x, y), 
      bodyType: 'fixed' 
    });
    
    const rb = engine.ecs.rigidBodies.get(id);
    if (rb) engine.physics.createCollider(id, rb.handle, COLLIDER_SIZE, COLLIDER_SIZE);
  }
}

/**
 * Spawns the Elder NPC with dialog interaction
 */
function spawnElder(engine: Engine2DService): void {
  const { POSITION, SIZE, INTERACTION_RADIUS, COLLIDER_SIZE } = VILLAGE_CONFIG.ELDER;
  
  const elderId = EntityGenerator.generate();
  engine.ecs.addEntity(elderId);
  
  engine.ecs.transforms.set(elderId, { 
    x: POSITION.x, 
    y: POSITION.y, 
    rotation: 0, 
    scaleX: 1, 
    scaleY: 1, 
    prevX: POSITION.x, 
    prevY: POSITION.y, 
    prevRotation: 0 
  });
  
  engine.ecs.sprites.set(elderId, { 
    color: COLORS.ELDER, 
    textureId: TEXTURES.NPC, 
    width: SIZE.width, 
    height: SIZE.height, 
    layer: 2, 
    opacity: 1 
  });
  
  engine.ecs.rigidBodies.set(elderId, { 
    handle: engine.physics.createBody(elderId, 'fixed', POSITION.x, POSITION.y), 
    bodyType: 'fixed' 
  });
  
  const elderRb = engine.ecs.rigidBodies.get(elderId);
  if (elderRb) {
    engine.physics.createCollider(elderId, elderRb.handle, COLLIDER_SIZE, COLLIDER_SIZE);
  }
  
  // Interaction System
  engine.ecs.interactions.set(elderId, { 
    radius: INTERACTION_RADIUS, 
    label: 'Talk', 
    triggerId: 'elder_talk' 
  });
  
  // Dialog System
  engine.ecs.dialogs.set(elderId, { 
    speaker: 'Elder_Kael', 
    text: 'The Physics Lab has been overrun by anomalies. Enter the portal to the North if you dare.' 
  });
}

/**
 * Spawns the dungeon portal with scene transition capability
 */
function spawnDungeonPortal(engine: Engine2DService): void {
  const { POSITION, SIZE, INTERACTION_RADIUS, FORCE_STRENGTH, FORCE_RADIUS } = VILLAGE_CONFIG.PORTAL;
  
  const portalId = EntityGenerator.generate();
  engine.ecs.addEntity(portalId);
  
  engine.ecs.transforms.set(portalId, { 
    x: POSITION.x, 
    y: POSITION.y, 
    rotation: 0, 
    scaleX: 1, 
    scaleY: 1, 
    prevX: POSITION.x, 
    prevY: POSITION.y, 
    prevRotation: 0 
  });
  
  engine.ecs.sprites.set(portalId, { 
    color: COLORS.PORTAL, 
    textureId: TEXTURES.PORTAL, 
    width: SIZE.width, 
    height: SIZE.height, 
    layer: 1, 
    opacity: 0.8 
  });
  
  // Portal Interaction
  engine.ecs.interactions.set(portalId, { 
    radius: INTERACTION_RADIUS, 
    label: 'Enter Dungeon', 
    triggerId: 'enter_dungeon' 
  });
  
  // Scene Transition Logic
  engine.ecs.portals.set(portalId, { 
    targetSceneId: 'playground', 
    spawnX: 0, 
    spawnY: 0 
  });
  
  // Visual Effect: Subtle repulsion field
  engine.ecs.forceFields.set(portalId, { 
    strength: FORCE_STRENGTH, 
    radius: FORCE_RADIUS, 
    active: true 
  });
}
