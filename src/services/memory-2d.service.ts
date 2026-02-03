import { Injectable, signal, computed } from '@angular/core';

export interface LogEntry {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  tier: 0 | 1 | 2;
}

export interface SessionSummary {
  startTime: number;
  commandCount: number;
  topVerbs: Map<string, number>;
  notableEvents: string[];
}

/**
 * [PROTOCOL_MEMORY_ARCH_V2.0] Implementation
 * Tiered memory system: Ephemeral -> Semantic -> Persistent -> Narrative (Agent-Synced).
 */
@Injectable({ providedIn: 'root' })
export class MemorySystem2DService {
  // Tier 0: Ephemeral
  private readonly LRU_CAPACITY = 128;
  private _tier0 = new Map<string, LogEntry>();
  
  // Tier 1: Semantic
  private _tier1: LogEntry[] = [];
  
  // Tier 2: Persistent (IndexedDB)
  private readonly DB_NAME = 'Qualia2D_Mem_v1';
  private readonly STORE_NAME = 'logs';
  private db: IDBDatabase | null = null;

  // Session Data
  private readonly startTime = Date.now();
  private commandUsage = new Map<string, number>();
  
  // Observability Signals
  readonly stats = signal<{ t0: number, t1: number, t2: number }>({ t0: 0, t1: 0, t2: 0 });
  
  readonly sessionSummary = computed<SessionSummary>(() => {
    // Computed based on T1 state
    const verbs = new Map<string, number>();
    this._tier1.forEach(e => {
      const verb = e.content.split(':')[0]?.trim();
      if (verb) verbs.set(verb, (verbs.get(verb) || 0) + 1);
    });

    return {
      startTime: this.startTime,
      commandCount: this._tier1.length,
      topVerbs: verbs,
      notableEvents: this._tier1.filter(e => e.tags.includes('notable')).map(e => e.content)
    };
  });

  constructor() {
    this.initDB();
  }

  private initDB() {
    if (typeof indexedDB === 'undefined') return;
    const req = indexedDB.open(this.DB_NAME, 1);
    
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(this.STORE_NAME)) {
        db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
      }
    };
    
    req.onsuccess = (e: any) => {
      this.db = e.target.result;
      this.audit();
    };
    
    req.onerror = (e) => console.warn('Qualia2D: Memory DB Error', e);
  }

  /**
   * INGEST [ACTION]
   * Automated ingestion called by CommandRegistry.
   */
  ingest(content: string, tags: string[] = []) {
    const id = crypto.randomUUID();
    const entry: LogEntry = {
      id,
      timestamp: Date.now(),
      content,
      tags,
      tier: 0
    };

    // T0: LRU
    if (this._tier0.size >= this.LRU_CAPACITY) {
      const first = this._tier0.keys().next().value;
      if (first) this._tier0.delete(first);
    }
    this._tier0.set(id, entry);

    // T1: Semantic
    this._tier1.push({ ...entry, tier: 1 });

    // T2: Persistent
    this.saveToDisk({ ...entry, tier: 2 });
    
    this.updateLiveStats();
  }

  compact() {
    if (this._tier1.length > 100) {
      this._tier1 = this._tier1.slice(-100);
    }
    this.updateLiveStats();
  }

  audit() {
    if (!this.db) return;
    const tx = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const countReq = store.count();
    
    countReq.onsuccess = () => {
      this.stats.set({
        t0: this._tier0.size,
        t1: this._tier1.length,
        t2: countReq.result
      });
    };
  }

  private saveToDisk(entry: LogEntry) {
    if (!this.db) return;
    try {
      const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
      tx.objectStore(this.STORE_NAME).add(entry);
    } catch (e) {
      // Fail silently for quota issues
    }
  }

  private updateLiveStats() {
    this.stats.update(s => ({
      ...s,
      t0: this._tier0.size,
      t1: this._tier1.length
    }));
  }
}