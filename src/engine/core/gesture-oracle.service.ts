import { Injectable } from '@angular/core';

export enum GestureType {
  NONE = 0,
  TAP = 1,
  DRAG = 2,
  FLICK = 3,
  HOLD = 4
}

/**
 * Deterministic Gesture Automaton.
 * Uses a pre-computed Lookup Table (LUT) for O(1) classification.
 * Mimics WASM memory layout using TypedArrays.
 */
@Injectable({ providedIn: 'root' })
export class GestureOracleService {
  // 32x32x32 LUT = 32768 bytes
  private table = new Uint8Array(32 * 32 * 32); 
  private ready = false;

  constructor() {
    this.synthesizeTable();
  }

  /**
   * [RUN_ORACLE_SYNTH]
   * Generates the classification table. 
   * In a real WASM setup, this would be pre-compiled.
   */
  synthesizeTable() {
    // Fill table with heuristics mapped to discrete buckets
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        for (let t = 0; t < 32; t++) {
          const idx = x | (y << 5) | (t << 10);
          this.table[idx] = this.classifyDiscrete(x, y, t);
        }
      }
    }
    this.ready = true;
    console.log('Qualia2D: Gesture Oracle Synthesized (32KB)');
  }

  /**
   * Classifies a raw input delta vector into a gesture.
   * Zero-allocation.
   * @param dx Normalized X delta (-1 to 1)
   * @param dy Normalized Y delta (-1 to 1)
   * @param dt Normalized Time delta (0 to 1, where 1 is max gesture time ~500ms)
   */
  classify(dx: number, dy: number, dt: number): GestureType {
    if (!this.ready) return GestureType.NONE;

    // Normalize floats to 0-31 integer buckets
    // Map -1..1 to 0..31
    const ix = Math.min(31, Math.max(0, Math.floor(((dx + 1) / 2) * 31)));
    const iy = Math.min(31, Math.max(0, Math.floor(((dy + 1) / 2) * 31)));
    const it = Math.min(31, Math.max(0, Math.floor(dt * 31)));

    const idx = ix | (iy << 5) | (it << 10);
    return this.table[idx] as GestureType;
  }

  private classifyDiscrete(ix: number, iy: number, it: number): GestureType {
    // Reconstruct normalized values
    const nx = (ix / 31) * 2 - 1;
    const ny = (iy / 31) * 2 - 1;
    const nt = it / 31; // 0 is instant, 1 is long

    const distSq = nx*nx + ny*ny;
    
    // Heuristics baked into LUT
    if (distSq < 0.05 && nt < 0.3) return GestureType.TAP;
    if (distSq < 0.05 && nt >= 0.3) return GestureType.HOLD;
    if (distSq > 0.1 && nt < 0.2) return GestureType.FLICK;
    if (distSq > 0.05) return GestureType.DRAG;

    return GestureType.NONE;
  }
}