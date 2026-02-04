
import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

export interface DemoManifest {
  id: string;
  name: string;
  description: string;
  thumbnailIcon: string;
  scene: ScenePreset2D;
}

/**
 * [RUN_UI]: Slime Soccer Overhaul.
 * [REPAIR]: Fixed "Missing floor render" by repositioning ground to Sector-Alpha coordinates.
 * [REPAIR]: Fixed "Improper sprite rendering" by centering Slime avatars.
 */
export const SLIME_SOCCER_SCENE: ScenePreset2D = {
  id: 'demo_slime_match',
  name: 'Slime Stadium',
  description: '1v1 Physics Soccer. Platformer topology with high-restitution ball dynamics.',
  tags: ['Demo', 'Sport', 'Physics'],
  complexity: 'medium',
  preferredTopology: 'platformer',
  
  config: {
    env: {
      type: 'atmosphere',
      background: '#020617', 
      horizon: '#1e3a8a',
      gridOpacity: 0.1
    },
    physics: {
      gravity: { x: 0, y: -25 } // High gravity for snappy sports feel
    }
  },

  load: (engine: Engine2DService) => {
    engine.state.setTopology('platformer');
    
    // 1. Stadium Geometry (Floor & Walls)
    // [HtT]: Offset floor slightly higher to ensure it's comfortably within default viewport
    const floorY = -4; 
    engine.spawnBox(0, floorY, '#1e293b', 40, 2, 'fixed'); // Ground (Slate-800)
    engine.spawnBox(-18, 5, '#0f172a', 1, 20, 'fixed'); // Left Wall
    engine.spawnBox(18, 5, '#0f172a', 1, 20, 'fixed'); // Right Wall
    engine.spawnBox(0, 15, '#0f172a', 40, 1, 'fixed'); // Ceiling

    // 2. Goals
    const leftGoal = engine.spawnFromTemplate('sport_goal_post', -15, floorY + 2.5);
    if (leftGoal) engine.updateEntityName(leftGoal, 'Goal_P1');
    
    const rightGoal = engine.spawnFromTemplate('sport_goal_post', 15, floorY + 2.5);
    if (rightGoal) {
        engine.updateEntityName(rightGoal, 'Goal_P2');
        const s = engine.ecs.getSprite(rightGoal);
        if (s) s.flipX = true;
    }

    // 3. The Ball
    const ballId = engine.spawnFromTemplate('sport_ball_std', 0, 0);
    if (ballId) {
      engine.updateEntityName(ballId, 'Match_Ball');
      // High bounciness for arcade feel
      const col = engine.ecs.colliders.get(ballId);
      if (col) col.handle.setRestitution(0.9);
    }

    // 4. Player 1 (Slime)
    const p1 = engine.factory.spawnPlayer(-8, floorY + 3);
    engine.updateEntityName(p1, 'Pilot_Alpha');
    
    // Disable flipbook animations to prevent "pink block" cropping
    engine.ecs.animations.delete(p1); 
    
    const p1Sprite = engine.ecs.getSprite(p1);
    if (p1Sprite) {
        p1Sprite.textureId = 'tex_slime';
        p1Sprite.width = 2.4; // Slightly larger for better cyclops visibility
        p1Sprite.height = 2.4;
    }
    
    // Ball-physics for slimes
    const p1Rb = engine.ecs.rigidBodies.get(p1);
    const p1Col = engine.ecs.colliders.get(p1);
    if (p1Rb && p1Col) {
       engine.physics.world?.removeCollider(p1Col.handle, true);
       engine.physics.createCollider(p1, p1Rb.handle, 2.2, 2.2, 'ball'); 
    }

    // 5. Opponent (Bot Slime)
    const p2 = engine.factory.spawnPlayer(8, floorY + 3);
    engine.updateEntityName(p2, 'Pilot_Beta');
    engine.ecs.animations.delete(p2);
    
    const p2Sprite = engine.ecs.getSprite(p2);
    if (p2Sprite) {
        p2Sprite.textureId = 'tex_slime';
        p2Sprite.color = '#f43f5e'; // Rose tint
        p2Sprite.width = 2.4;
        p2Sprite.height = 2.4;
        p2Sprite.flipX = true;
    }

    const p2Rb = engine.ecs.rigidBodies.get(p2);
    const p2Col = engine.ecs.colliders.get(p2);
    if (p2Rb && p2Col) {
       engine.physics.world?.removeCollider(p2Col.handle, true);
       engine.physics.createCollider(p2, p2Rb.handle, 2.2, 2.2, 'ball');
    }
  }
};

export const SLIME_SOCCER_DEMO: DemoManifest = {
  id: 'demo_slime_soccer',
  name: 'Slime Soccer',
  description: 'Arcade physics sport. Control a gelatinous avatar to score goals.',
  thumbnailIcon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
  scene: SLIME_SOCCER_SCENE
};
