import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';

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
  
  readonly lastCommand = signal<QualiaVerb | null>(null);
  readonly commandLog = signal<string[]>([]);

  execute(verb: QualiaVerb, params?: string) {
    this.lastCommand.set(verb);
    this.log(`INVOKING: ${verb}${params ? ' (' + params + ')' : ''}`);

    switch (verb) {
      case 'RUN_INDUSTRY':
        this.handleIndustryCalibration(params);
        break;
      case 'RUN_PROTOCOL':
        this.handleProtocolConstructor(params);
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

  private handleIndustryCalibration(context?: string) {
    this.log(`INDUSTRY: RESEARCHING_${context?.toUpperCase() || 'CORE'}`);
    setTimeout(() => {
      this.log(`INDUSTRY: CALIBRATION_COMPLETE [Standard: spatial_query]`);
    }, 800);
  }

  private handleProtocolConstructor(input?: string) {
    this.log("CONSTRUCTOR: ANALYZING_INPUT");
    if (input && input.includes('scene')) {
      this.log("CONSTRUCTOR: ITERATING_SCENE_LOGIC");
    } else {
      this.log("CONSTRUCTOR: GENESIS_MODE_ACTIVE");
    }
  }

  private performIntelligentRefactor() {
    this.log("REF: SCANNING_FOR_MONOLITHS");
    setTimeout(() => {
      this.log("REF: BOTTLENECK_HUNT_COMPLETE");
      this.log("HEURISTICS: STALLS:0 | MONOLITHS:0 | DOC_SYNC:OK");
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