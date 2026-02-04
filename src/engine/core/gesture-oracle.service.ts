import { Injectable } from '@angular/core';

export enum GestureType {
  NONE = 0,
  TAP = 1,
  DRAG = 2,
  FLICK = 3,
  HOLD = 4
}

/**
 * Deterministic Gesture Automaton V2.0
 * [OPTIMIZATION]: Pre-computed Lookup Table (LUT) for zero-latency classification.
 */
@Injectable({ providedIn: 'root' })
export class GestureOracleService {
  // 32x32x32 buckets = 32,768 classifications
  private readonly table = new Uint8Array(32 * 32 * 32); 
  private ready = false;

  constructor() {
    this.synthesizeTable();
  }

  /**
   * Generates classification matrix based on input geometry.
   */
  private synthesizeTable() {
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        for (let t = 0; t < 32; t++) {
          const idx = x | (y << 5) | (t << 10);
          this.table[idx] = this.classifyHeuristic(x, y, t);
        }
      }
    }
    this.ready = true;
    console.log('Qualia2D: Gesture Oracle LUT Active (32KB)');
  }

  classify(dx: number, dy: number, dt: number): GestureType {
    if (!this.ready) return GestureType.NONE;

    // Quantize floating input into 5-bit indices
    const ix = Math.min(31, Math.max(0, Math.floor(((dx + 1) / 2) * 31)));
    const iy = Math.min(31, Math.max(0, Math.floor(((dy + 1) / 2) * 31)));
    const it = Math.min(31, Math.max(0, Math.floor(dt * 31)));

    const idx = ix | (iy << 5) | (it << 10);
    return this.table[idx] as GestureType;
  }

  private classifyHeuristic(ix: number, iy: number, it: number): GestureType {
    const nx = (ix / 31) * 2 - 1;
    const ny = (iy / 31) * 2 - 1;
    const nt = it / 31; 

    const dSq = nx*nx + ny*ny;
    
    if (dSq < 0.05 && nt < 0.3) return GestureType.TAP;
    if (dSq < 0.05 && nt >= 0.3) return GestureType.HOLD;
    if (dSq > 0.15 && nt < 0.2) return GestureType.FLICK;
    if (dSq > 0.02) return GestureType.DRAG;

    return GestureType.NONE;
  }
}