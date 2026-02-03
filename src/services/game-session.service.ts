import { Injectable, signal, computed } from '@angular/core';

export interface QuestFlag {
  id: string;
  value: boolean;
}

/**
 * [PROTOCOL_INDUSTRY] Game Session Manager.
 * Persists "Project" state across scene transitions (Inventory, Flags, Narrative).
 */
@Injectable({ providedIn: 'root' })
export class GameSessionService {
  // Persistent State
  readonly gold = signal(0);
  readonly xp = signal(0);
  readonly level = computed(() => Math.floor(this.xp() / 1000) + 1);
  
  // Narrative State
  private flags = new Map<string, boolean>();
  
  // Dialog State
  readonly activeDialog = signal<{ speaker: string, text: string } | null>(null);
  readonly isDialogActive = computed(() => this.activeDialog() !== null);

  // Actions
  addGold(amount: number) {
    this.gold.update(g => g + amount);
  }

  addXp(amount: number) {
    this.xp.update(x => x + amount);
  }

  setFlag(id: string, value: boolean) {
    this.flags.set(id, value);
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
}