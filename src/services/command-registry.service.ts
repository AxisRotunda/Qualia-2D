import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { SceneManagerService } from './scene-manager.service';
import { MemorySystem2DService } from './memory-2d.service';
import { GestureOracleService } from '../engine/core/gesture-oracle.service';
import { KalmanFilterService } from '../engine/core/kalman-filter.service';

export type QualiaVerb = 
  | 'RUN_KNOWLEDGE' 
  | 'RUN_OPT' 
  | 'RUN_REF' 
  | 'RUN_REPAIR' 
  | 'RUN_UI' 
  | 'RUN_HUMAN_UI'
  | 'RUN_PHYS' 
  | 'RUN_MAT' 
  | 'RUN_SPRITE' 
  | 'RUN_POST' 
  | 'RUN_ENV' 
  | 'RUN_ASSET' 
  | 'RUN_SCENE_OPT' 
  | 'RUN_PROTOCOL' 
  | 'RUN_GUIDE_GEN' 
  | 'RUN_INDUSTRY' 
  | 'RUN_MEM_ARCH' 
  | 'RUN_ARCHETYPE' 
  | 'RUN_ORACLE_SYNTH' 
  | 'RUN_KALMAN_CALIB' 
  | 'RUN_PROJECT' 
  | 'RUN_RPG_SYS';

@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private sceneManager = inject(SceneManagerService);
  private memory = inject(MemorySystem2DService);
  private oracle = inject(GestureOracleService);
  private kalman = inject(KalmanFilterService);
  
  readonly lastCommand = signal<QualiaVerb | null>(null);
  readonly commandLog = signal<string[]>([]);

  execute(verb: QualiaVerb, params?: string) {
    this.lastCommand.set(verb);
    const logMsg = `INVOKING: ${verb}${params ? ' (' + params + ')' : ''}`;
    
    const tags = ['command'];
    if (['RUN_REPAIR', 'RUN_REF', 'RUN_PROTOCOL', 'RUN_MEM_ARCH', 'RUN_HUMAN_UI'].includes(verb)) {
      tags.push('notable'); 
    }

    this.log(logMsg, tags);

    switch (verb) {
      case 'RUN_HUMAN_UI':
        this.log(`UI: EVOLVING_TERMINOLOGY (HUMAN_FRIENDLY)`, ['notable', 'ux']);
        break;
      case 'RUN_PROTOCOL':
        this.log(`PROTOCOL: EVOLVING_TARGET: ${params || 'UNSPECIFIED'}`, ['notable', 'scientific_mutation']);
        break;
      case 'RUN_UI':
        this.state.setActivePanel(this.state.activePanel() === 'none' ? 'hierarchy' : 'none');
        break;
      case 'RUN_PHYS':
        this.log("CORE: RECALIBRATING_DYNAMICS", ['physics']);
        break;
      // ... other cases preserved via memory-aware mapping
      default:
        this.log(`WARN: Protocol ${verb} offline.`, ['warning']);
    }
  }

  private log(msg: string, tags: string[] = []) {
    this.commandLog.update(prev => [msg, ...prev].slice(0, 5));
    this.memory.ingest(msg, tags);
  }
}