import { Injectable, signal } from '@angular/core';

export interface LogEntry {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  tier: 0 | 1 | 2;
}

/**
 * [PROTOCOL_MEMORY_ARCH_V1.0] Implementation
 * Tiered memory system: Ephemeral (Map) -> Semantic (Array) -> Persistent (IndexedDB).
 */
@Injectable({ providedIn: 'root' })
export class MemorySystem2DService {
  // Tier 0: Ephemeral (Map for O(1) lookup, tracking insertion order via keys)
  private readonly LRU_CAPACITY = 128;
  private _tier0 = new Map<string, LogEntry>();
  
  // Tier 1: Semantic Buffer (Array for iteration/clustering)
  private _tier1: LogEntry[] = [];
  
  // Tier 2: Persistent Storage
  private readonly DB_NAME = 'Qualia2D_Mem_v1';
  private readonly STORE_NAME = 'logs';
  private db: IDBDatabase | null = null;

  // Observability
  readonly stats = signal<{ t0: number, t1: number, t2: number }>({ t0: 0, t1: 0, t2: 0 });

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
      this.audit(); // Initial audit on load
    };
    
    req.onerror = (e) => console.warn('Qualia2D: Memory DB failed', e);
  }

  /**
   * INGEST [ACTION]
   * Entry point for new memory fragments. Flows through T0 -> T1 -> T2.
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

    // Tier 0: LRU Eviction
    if (this._tier0.size >= this.LRU_CAPACITY) {
      const first = this._tier0.keys().next().value;
      if (first) this._tier0.delete(first);
    }
    this._tier0.set(id, entry);

    // Tier 1: Promotion
    this._tier1.push({ ...entry, tier: 1 });

    // Tier 2: Async Persist
    this.saveToDisk({ ...entry, tier: 2 });
    
    this.updateLiveStats();
  }

  /**
   * COMPACT [ACTION]
   * Prunes Tier 1 to prevent memory bloat during long sessions.
   */
  compact() {
    // Heuristic: Keep last 100 semantic entries
    if (this._tier1.length > 100) {
      this._tier1 = this._tier1.slice(-100);
    }
    this.updateLiveStats();
  }

  /**
   * AUDIT [ACTION]
   * Performs a deep count of the persistent store.
   */
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
    const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
    tx.objectStore(this.STORE_NAME).add(entry);
  }

  private updateLiveStats() {
    this.stats.update(s => ({
      ...s,
      t0: this._tier0.size,
      t1: this._tier1.length
    }));
  }
}