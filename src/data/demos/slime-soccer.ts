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
      background: '#0f172a', 
      horizon: '#3b82f6',
      gridOpacity: 0.05
    },
    physics: {
      gravity: { x: 0, y: -15 } // Higher gravity for snappy jumps
    }
  },

  load: (engine: Engine2DService) => {
    engine.state.setTopology('platformer');
    
    // 1. Stadium Geometry (Floor & Walls)
    const floorY = -6;
    engine.spawnBox(0, floorY, '#334155', 30, 1, 'fixed'); // Ground
    engine.spawnBox(-14, 0, '#1e293b', 1, 14, 'fixed'); // Left Wall
    engine.spawnBox(14, 0, '#1e293b', 1, 14, 'fixed'); // Right Wall
    engine.spawnBox(0, 7, '#1e293b', 30, 1, 'fixed'); // Ceiling

    // 2. Goals
    const leftGoal = engine.spawnFromTemplate('sport_goal_post', -11, floorY + 2);
    if (leftGoal) engine.updateEntityName(leftGoal, 'Goal_P1');
    
    const rightGoal = engine.spawnFromTemplate('sport_goal_post', 11, floorY + 2);
    if (rightGoal) {
        engine.updateEntityName(rightGoal, 'Goal_P2');
        // Flip right goal
        const s = engine.ecs.getSprite(rightGoal);
        if (s) s.flipX = true;
    }

    // 3. The Ball
    const ballId = engine.spawnFromTemplate('sport_ball_std', 0, 0);
    if (ballId) engine.updateEntityName(ballId, 'Match_Ball');

    // 4. Player (Slime)
    // Custom spawn logic for Slime Player to use 'tex_slime' and specific physics
    const p1 = engine.factory.spawnPlayer(-5, -4);
    engine.updateEntityName(p1, 'Player_1');
    
    // Override Player Visuals to Slime
    const p1Sprite = engine.ecs.getSprite(p1);
    if (p1Sprite) {
        p1Sprite.textureId = 'tex_slime';
        p1Sprite.width = 2;
        p1Sprite.height = 2;
    }
    
    // Override Player Physics (Ball shape for smooth headers)
    const p1Rb = engine.ecs.rigidBodies.get(p1);
    if (p1Rb) {
       engine.physics.world?.removeCollider(engine.ecs.colliders.get(p1)?.handle, true);
       const newCol = engine.physics.createCollider(p1, p1Rb.handle, 2, 2); // Creates Box by default in factory, need Ball logic?
       // Factory uses createCollider which makes cuboids. 
       // For this demo, we accept the cuboid approximation or would need a 'setColliderShape' method.
       // Given the constraints, a cuboid slime is acceptable for V1.
    }

    // 5. Opponent (Dummy)
    const p2 = engine.spawnBox(5, -4, '#f43f5e', 2, 2, 'dynamic');
    engine.updateEntityName(p2, 'Opponent_Bot');
    const p2Sprite = engine.ecs.getSprite(p2);
    if (p2Sprite) {
        p2Sprite.textureId = 'tex_slime';
        p2Sprite.color = '#f43f5e'; // Tint red
        p2Sprite.flipX = true;
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