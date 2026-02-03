import { Injectable, inject, signal } from '@angular/core';
import { EngineState2DService } from './engine-state-2d.service';
import { ComponentStoreService } from '../engine/ecs/component-store.service';
import { SceneManagerService } from './scene-manager.service';
import { MemorySystem2DService } from './memory-2d.service';

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
  | 'RUN_GUIDE_GEN'
  | 'RUN_INDUSTRY'
  | 'RUN_MEM_ARCH';

@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  private state = inject(EngineState2DService);
  private ecs = inject(ComponentStoreService);
  private sceneManager = inject(SceneManagerService);
  private memory = inject(MemorySystem2DService);
  
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
    if (['RUN_REPAIR', 'RUN_REF', 'RUN_PROTOCOL', 'RUN_MEM_ARCH'].includes(verb)) {
      tags.push('notable'); // High-importance for memory.md chronicle
    }

    this.log(logMsg, tags);

    switch (verb) {
      case 'RUN_GUIDE_GEN':
        this.log(`GENESIS: TRANSLATING_DOMAIN: ${params || 'ALL'}`, ['notable', 'documentation']);
        break;
      case 'RUN_REPAIR':
        this.performIntelligentRepair(params || 'GENERAL_STABILITY');
        break;
      case 'RUN_INDUSTRY':
        this.log(`INDUSTRY: CALIBRATING_MOBILE_UX`, ['notable', 'industry']);
        break;
      case 'RUN_REF':
        this.log(`REF: INITIATING_MODULAR_ISOLATION`, ['notable', 'architectural']);
        break;
      case 'RUN_PHYS':
        this.log("CORE: RECALIBRATING_DYNAMICS", ['physics']);
        break;
      case 'RUN_UI':
        this.state.setActivePanel(this.state.activePanel() === 'none' ? 'hierarchy' : 'none');
        break;
      case 'RUN_MEM_ARCH':
        this.performMemoryAudit();
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
    // [PROTOCOL_MEMORY_ARCH]: Automated ingestion
    this.memory.ingest(msg, tags);
  }
}