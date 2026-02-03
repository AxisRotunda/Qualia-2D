import { Injectable, inject } from '@angular/core';
import { EntityFactoryService } from '../engine/factory/entity-factory.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { CameraService } from '../engine/core/camera.service';

@Injectable({ providedIn: 'root' })
export class Spawner2DService {
  private factory = inject(EntityFactoryService);
  private ecs = inject(ComponentStoreService);
  private camera = inject(CameraService);

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
}