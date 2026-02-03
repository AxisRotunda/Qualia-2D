
import { EntityGenerator } from '../../engine/ecs/entity';
import type { Engine2DService } from '../../services/engine-2d.service';
import type { ScenePreset2D } from '../../engine/scene.types';

/**
 * [PROTOCOL_INDUSTRY] Ghost Village (RPG Demo Hub).
 * Features:
 * - Persistent Game State connections (via Portal).
 * - Narrative Interaction (Dialog).
 * - Procedural Environment (Trees).
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
    engine.factory.spawnPlayer(0, 0);

    // 1. Procedural Forest Boundary
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.random() * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const id = EntityGenerator.generate();
        engine.ecs.addEntity(id);
        engine.ecs.transforms.set(id, { x, y, rotation: 0, scaleX: 1, scaleY: 1 });
        engine.ecs.sprites.set(id, { color: '#064e3b', textureId: 'tex_tree', width: 2, height: 3, layer: 2, opacity: 1 });
        engine.ecs.rigidBodies.set(id, { handle: engine.physics.createBody(id, 'fixed', x, y), bodyType: 'fixed' });
        // Trees are solid
        const rb = engine.ecs.rigidBodies.get(id);
        if (rb) engine.physics.createCollider(id, rb.handle, 0.5, 0.5);
    }

    // 2. The Elder NPC
    const elderId = EntityGenerator.generate();
    engine.ecs.addEntity(elderId);
    engine.ecs.transforms.set(elderId, { x: 5, y: 5, rotation: 0, scaleX: 1, scaleY: 1 });
    engine.ecs.sprites.set(elderId, { color: '#fbbf24', textureId: 'tex_npc', width: 1.5, height: 1.5, layer: 2, opacity: 1 });
    engine.ecs.rigidBodies.set(elderId, { handle: engine.physics.createBody(elderId, 'fixed', 5, 5), bodyType: 'fixed' });
    const elderRb = engine.ecs.rigidBodies.get(elderId);
    if(elderRb) engine.physics.createCollider(elderId, elderRb.handle, 1, 1);
    
    // NPC Logic
    engine.ecs.interactions.set(elderId, { radius: 2.5, label: 'Talk', triggerId: 'elder_talk' });
    engine.ecs.dialogs.set(elderId, { 
        speaker: 'Elder_Kael', 
        text: 'The Physics Lab has been overrun by anomalies. Enter the portal to the North if you dare.' 
    });

    // 3. The Portal (Dungeon Entrance)
    const portalId = EntityGenerator.generate();
    engine.ecs.addEntity(portalId);
    engine.ecs.transforms.set(portalId, { x: 0, y: 15, rotation: 0, scaleX: 1, scaleY: 1 });
    engine.ecs.sprites.set(portalId, { color: '#10b981', textureId: 'tex_portal', width: 4, height: 4, layer: 1, opacity: 0.8 });
    
    // Portal Logic
    engine.ecs.interactions.set(portalId, { radius: 2.0, label: 'Enter Dungeon', triggerId: 'enter_dungeon' });
    engine.ecs.portals.set(portalId, { targetSceneId: 'playground', spawnX: 0, spawnY: 0 }); // Links to Physics Lab
    
    // Visual Marker for Portal
    engine.ecs.forceFields.set(portalId, { strength: -5, radius: 4, active: true }); // Slight repulsion visual
  }
};