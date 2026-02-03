
import { Injectable, inject } from '@angular/core';
import { EngineState2DService } from '../../services/engine-state-2d.service';
import { Input2DService } from '../../services/input-2d.service';
import { ComponentStoreService } from '../ecs/component-store.service';

@Injectable({ providedIn: 'root' })
export class PhysicsSystem2DService {
  private state = inject(EngineState2DService);
  private input = inject(Input2DService);
  private ecs = inject(ComponentStoreService);

  applyForces(dt: number) {
    this.ecs.forceFields.forEach((field, fieldId) => {
      if (!field.active) return;
      const fieldTransform = this.ecs.getTransform(fieldId);
      if (!fieldTransform) return;

      this.ecs.rigidBodies.forEach((rb, entityId) => {
        if (rb.bodyType !== 'dynamic') return;
        const entityTransform = this.ecs.getTransform(entityId);
        if (!entityTransform) return;

        const dx = fieldTransform.x - entityTransform.x;
        const dy = fieldTransform.y - entityTransform.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = field.radius * field.radius;

        if (distSq < radiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const forceMag = (field.strength * dt) / (distSq + 0.5);
          const fx = (dx / dist) * forceMag;
          const fy = (dy / dist) * forceMag;
          rb.handle.applyImpulse({ x: fx, y: fy }, true);
        }
      });
    });
  }

  applyDraggingForces(dt: number) {
    const selectedId = this.state.selectedEntityId();
    const target = this.input.dragTargetPos();
    if (!this.input.isDragging() || !selectedId || !target) return;

    const rb = this.ecs.rigidBodies.get(selectedId);
    if (!rb || rb.bodyType !== 'dynamic' || this.state.mode() === 'edit') return;

    const currentPos = rb.handle.translation();
    const dx = target.x - currentPos.x;
    const dy = target.y - currentPos.y;

    const stiffness = 20.0;
    const maxVelocity = 50.0;

    let vx = dx * stiffness;
    let vy = dy * stiffness;

    const mag = Math.sqrt(vx*vx + vy*vy);
    if (mag > maxVelocity) {
      vx = (vx / mag) * maxVelocity;
      vy = (vy / mag) * maxVelocity;
    }

    rb.handle.setLinvel({ x: vx, y: vy }, true);
  }
}
