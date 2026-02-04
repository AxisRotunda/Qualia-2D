import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { ProjectService } from './project.service';

export interface QuestFlag {
  id: string;
  value: boolean;
}

export interface SessionData {
  gold: number;
  xp: number;
  flags: Record<string, boolean>;
}

/**
 * [PROTOCOL_INDUSTRY] Game Session Manager.
 * Persists "Project" state across scene transitions (Inventory, Flags, Narrative).
 * Now fully integrated with ProjectService for isolated save slots.
 */
@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private storage = inject(StorageService);
  private project = inject(ProjectService);

  // Persistent State
  readonly gold = signal(0);
  readonly xp = signal(0);
  readonly level = computed(() => Math.floor(this.xp() / 1000) + 1);
  
  // Narrative State (In-Memory)
  private flags = new Map<string, boolean>();
  
  // Dialog State
  readonly activeDialog = signal<{ speaker: string, text: string } | null>(null);
  readonly isDialogActive = computed(() => this.activeDialog() !== null);

  constructor() {
    // [RUN_MEM_ARCH] Auto-Load on Project Switch
    effect(() => {
      const projId = this.project.activeProjectId();
      if (projId) {
        this.loadSession(projId);
      }
    });

    // [RUN_MEM_ARCH] Auto-Save on Mutation
    effect(() => {
      const projId = this.project.activeProjectId();
      const g = this.gold();
      const x = this.xp();
      // Flags are mapped below, triggered manually or via separate signal if needed
      // For now, we save on gold/xp change. 
      // ideally flags should be a signal too for reactivity, but Map is mutable.
      if (projId) {
        this.saveSession(projId);
      }
    });
  }

  // Actions
  addGold(amount: number) {
    this.gold.update(g => g + amount);
  }

  addXp(amount: number) {
    this.xp.update(x => x + amount);
  }

  setFlag(id: string, value: boolean) {
    this.flags.set(id, value);
    const projId = this.project.activeProjectId();
    if (projId) this.saveSession(projId);
  }

  getFlag(id: string): boolean {
    return this.flags.get(id) || false;
  }

  startDialog(speaker: string, text: string) {
    this.activeDialog.set({ speaker, text });
  }

  closeDialog() {
    this.activeDialog.set(null);
  }

  private loadSession(projId: string) {
    const key = `session_${projId}`;
    const data = this.storage.load<SessionData | null>(key, null);
    
    if (data) {
      this.gold.set(data.gold);
      this.xp.set(data.xp);
      this.flags.clear();
      Object.entries(data.flags).forEach(([k, v]) => this.flags.set(k, v as boolean));
    } else {
      // New Session Defaults
      this.gold.set(0);
      this.xp.set(0);
      this.flags.clear();
    }
  }

  private saveSession(projId: string) {
    const key = `session_${projId}`;
    const data: SessionData = {
      gold: this.gold(),
      xp: this.xp(),
      flags: Object.fromEntries(this.flags)
    };
    this.storage.save(key, data);
  }
}