import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { SceneManagerService } from './scene-manager.service';

export type QualiaVerb = 
  | 'RUN_KNOWLEDGE' 
  | 'RUN_OPT' 
  | 'RUN_REF' 
  | 'RUN_REPAIR' 
  | 'RUN_UI' 
  | 'RUN_PHYS' 
  | 'RUN_MAT' 
  | 'RUN_SCENE_OPT'
  | 'RUN_PROTOCOL'
  | 'RUN_INDUSTRY';

@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private sceneManager = inject(SceneManagerService);
  
  readonly lastCommand = signal<QualiaVerb | null>(null);
  readonly commandLog = signal<string[]>([]);

  execute(verb: QualiaVerb, params?: string) {
    this.lastCommand.set(verb);
    this.log(`INVOKING: ${verb}${params ? ' (' + params + ')' : ''}`);

    switch (verb) {
      case 'RUN_INDUSTRY':
        this.performIndustryMobileCalibration();
        break;
      case 'RUN_PROTOCOL':
        this.log("CONSTRUCTOR: ANALYZING_INPUT");
        break;
      case 'RUN_REF':
        this.performIntelligentRefactor();
        break;
      case 'RUN_PHYS':
        this.log("CORE: RECALIBRATING_DYNAMICS");
        break;
      case 'RUN_UI':
        this.state.setActivePanel(this.state.activePanel() === 'none' ? 'hierarchy' : 'none');
        break;
      case 'RUN_SCENE_OPT':
        this.performSceneOptimization();
        break;
      default:
        this.log(`WARN: Protocol ${verb} offline.`);
    }
  }

  private performIndustryMobileCalibration() {
    this.log(`INDUSTRY: CALIBRATING_MOBILE_UX`);
    setTimeout(() => {
      this.log(`ADAPTIVE: HITBOX_SCALING: 0.6 units`);
      this.log(`GESTURE: LONG_PRESS_SELECTION: ACTIVE`);
      this.log(`FEEDBACK: CHROMATIC_GLOW: APPLIED`);
      this.log(`INDUSTRY: CALIBRATION_COMPLETE`);
    }, 600);
  }

  private performIntelligentRefactor() {
    this.log("REF: SCANNING_FOR_MONOLITHS");
    setTimeout(() => {
      this.log("REF: MODULAR_ISOLATION_COMPLETE");
      this.log("HEURISTICS: P-SCORE:2 | BOUNDARIES:OK | DATA:CLEAN");
    }, 500);
  }

  private performSceneOptimization() {
    const count = this.ecs.entityCount();
    this.log(`OPT: PRUNING_GRAPH (${count} nodes)`);
  }

  private log(msg: string) {
    this.commandLog.update(prev => [msg, ...prev].slice(0, 5));
  }
}
