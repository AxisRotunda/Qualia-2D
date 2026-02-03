import { Injectable, inject } from '@angular/core';
import { EntityFactoryService } from '../engine/factory/entity-factory.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { Camera2DService } from './camera-2d.service';
import { CommandRegistryService } from './command-registry.service';

export interface StreamConfig {
  count: number;
  batchSize?: number; // Check time every N items
  factory: (index: number) => void;
}

@Injectable({ providedIn: 'root' })
export class Spawner2DService {
  private factory = inject(EntityFactoryService);
  private ecs = inject(ComponentStoreService);
  private camera = inject(Camera2DService);
  private commands = inject(CommandRegistryService);

  spawnFromTemplate(templateId: string, x = 0, y = 0) {
    return this.factory.spawnFromTemplate(templateId, x, y);
  }

  spawnAtCamera(templateId: string) {
    const followId = this.camera.followedEntityId();
    const t = followId !== null ? this.ecs.getTransform(followId) : null;
    const x = t ? t.x : this.camera.x();
    const y = t ? t.y + 2 : this.camera.y() + 5;
    return this.spawnFromTemplate(templateId, x, y);
  }

  spawnBox(x = 0, y = 5, color = '#60a5fa', w = 1, h = 1, type: 'dynamic' | 'fixed' = 'dynamic') {
    return this.factory.spawnBox(x, y, color, w, h, type);
  }

  /**
   * [RUN_ARCHETYPE] Time-Sliced Entity Streaming.
   * Spawns entities in batches to respect a 12ms frame budget.
   * Yields to the browser via requestAnimationFrame to prevent blocking.
   */
  async spawnStream(config: StreamConfig) {
    const startTotal = performance.now();
    const batchSize = config.batchSize || 16;
    const frameBudgetMs = 12; // Leave ~4ms for browser overhead (60fps)
    
    let frameStart = performance.now();
    
    for (let i = 0; i < config.count; i++) {
      config.factory(i);

      // Check budget every batchSize iterations to reduce perf.now() overhead
      if (i % batchSize === 0) {
        if ((performance.now() - frameStart) > frameBudgetMs) {
          await new Promise(resolve => requestAnimationFrame(resolve));
          frameStart = performance.now();
        }
      }
    }

    const duration = performance.now() - startTotal;
    this.commands.execute('RUN_ARCHETYPE', `Streamed ${config.count} ents in ${duration.toFixed(1)}ms`);
  }
}