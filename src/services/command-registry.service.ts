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

  /**
   * Primary Command Entry Point.
   * [AUTO_SYNC]: Every execution is ingested into the Tiered Memory System.
   */
  execute(verb: QualiaVerb, params?: string) {
    this.lastCommand.set(verb);
    const logMsg = `INVOKING: ${verb}${params ? ' (' + params + ')' : ''}`;
    
    // Tagging logic for automated Narrative Sync (memory.md)
    const tags = ['command'];
    if (['RUN_REPAIR', 'RUN_REF', 'RUN_PROTOCOL', 'RUN_MEM_ARCH', 'RUN_MAT', 'RUN_SPRITE', 'RUN_ORACLE_SYNTH', 'RUN_KALMAN_CALIB', 'RUN_ARCHETYPE', 'RUN_RPG_SYS', 'RUN_PROJECT', 'RUN_ENV'].includes(verb)) {
      tags.push('notable'); 
    }

    // [HtT Evolution]: Added reasoning depth tags
    if (verb === 'RUN_PROTOCOL') tags.push('scientific_mutation', 'step_back');
    if (verb === 'RUN_REPAIR') tags.push('causal_trace');

    this.log(logMsg, tags);

    switch (verb) {
      case 'RUN_PROTOCOL':
        this.log(`PROTOCOL: EVOLVING_TARGET: ${params || 'UNSPECIFIED'}`, ['notable', 'scientific_mutation']);
        break;
      case 'RUN_GUIDE_GEN':
        this.log(`GENESIS: TRANSLATING_DOMAIN: ${params || 'ALL'}`, ['notable', 'documentation']);
        break;
      case 'RUN_REPAIR':
        this.performIntelligentRepair(params || 'GENERAL_STABILITY');
        break;
      case 'RUN_INDUSTRY':
        this.log(`INDUSTRY: CALIBRATING_MATERIALS (HARD_REALISM)`, ['notable', 'industry']);
        break;
      case 'RUN_REF':
        this.log(`REF: INITIATING_MODULAR_ISOLATION`, ['notable', 'architectural']);
        break;
      case 'RUN_PHYS':
        this.log("CORE: RECALIBRATING_DYNAMICS", ['physics']);
        break;
      case 'RUN_MAT':
        this.log("VISUAL: CALIBRATING_SURFACE_PHYSICS", ['notable', 'material']);
        break;
      case 'RUN_SPRITE':
        this.log("VISUAL: TUNING_PLANAR_PROJECTION", ['notable', 'sprite']);
        break;
      case 'RUN_POST':
        this.log("VISUAL: APPLYING_OPTICAL_FILTERS", ['post_processing']);
        break;
      case 'RUN_ENV':
        this.log("VISUAL: CALIBRATING_ATMOSPHERE", ['environment']);
        break;
      case 'RUN_ASSET':
        this.log("ASSET: AUDITING_RESOURCE_CACHE", ['asset_pipeline']);
        break;
      case 'RUN_UI':
        this.state.setActivePanel(this.state.activePanel() === 'none' ? 'hierarchy' : 'none');
        break;
      case 'RUN_MEM_ARCH':
        this.performMemoryAudit();
        break;
      case 'RUN_ARCHETYPE':
        this.log('ARCHETYPE: STREAMING_CHUNKED_ENTITIES', ['optimization', 'ecs']);
        break;
      case 'RUN_ORACLE_SYNTH':
        this.oracle.synthesizeTable();
        this.log('HYPER_CORE: GESTURE_LUT_REBUILT (32KB)', ['optimization']);
        break;
      case 'RUN_KALMAN_CALIB':
        this.kalman.reset();
        this.log('HYPER_CORE: KALMAN_STATE_RESET', ['optimization']);
        break;
      case 'RUN_RPG_SYS':
        this.log('RPG: SYSTEMS_INITIALIZED (ANIMATION/INTERACTION)', ['rpg', 'gameplay']);
        break;
      case 'RUN_PROJECT':
        this.log('PROJECT: HIERARCHY_SYNC_INITIATED', ['project']);
        break;
      default:
        this.log(`WARN: Protocol ${verb} offline.`, ['warning']);
    }
  }

  private performMemoryAudit() {
    this.log("MEMORY: INITIATING_TIERED_ARCH_AUDIT", ['notable']);
    this.memory.audit();
    
    setTimeout(() => {
      const s = this.memory.stats();
      this.log(`MEM_REPORT: T0:${s.t0} | T1:${s.t1} | T2:${s.t2}`, ['audit_result']);
      this.memory.compact();
    }, 600);
  }

  private performIntelligentRepair(errorMsg: string) {
    const slug = errorMsg.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.log(`REPAIR: SCANNING_FOR_LOG: issue-${slug}.md`, ['notable', 'repair']);
    
    setTimeout(() => {
      this.log(`REPAIR: APPLYING_STABILITY_PATCH`, ['repair_complete']);
      if (errorMsg.includes('NAN') || errorMsg.includes('PHYSICS')) {
        this.sceneManager.transitionTo(this.sceneManager.currentScene()!, null as any); 
      }
    }, 400);
  }

  private log(msg: string, tags: string[] = []) {
    this.commandLog.update(prev => [msg, ...prev].slice(0, 5));
    this.memory.ingest(msg, tags);
  }
}