import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';

export type QualiaVerb = 'RUN_KNOWLEDGE' | 'RUN_OPT' | 'RUN_REF' | 'RUN_REPAIR' | 'RUN_UI' | 'RUN_PHYS' | 'RUN_MAT' | 'RUN_SCENE_OPT';

@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  
  readonly lastCommand = signal<QualiaVerb | null>(null);
  readonly commandLog = signal<string[]>([]);

  execute(verb: QualiaVerb) {
    this.lastCommand.set(verb);
    this.log(`Invoking protocol for: ${verb}`);

    switch (verb) {
      case 'RUN_PHYS':
        // Reset physics world or recalibrate
        this.log("PROTOCOL: DYNAMICS_CALIBRATION_ACTIVE");
        break;
      case 'RUN_UI':
        this.state.setActivePanel(this.state.activePanel() === 'none' ? 'hierarchy' : 'none');
        break;
      case 'RUN_SCENE_OPT':
        this.performSceneOptimization();
        break;
      default:
        this.log(`WARN: Protocol ${verb} not yet implemented.`);
    }
  }

  private performSceneOptimization() {
    const entities = this.ecs.entitiesList();
    let removed = 0;
    // Logic to remove entities that are too far out of bounds
    this.log(`OPTIMIZATION: PRUNED ${removed} ENTITIES`);
  }

  private log(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.commandLog.update(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 5));
  }
}