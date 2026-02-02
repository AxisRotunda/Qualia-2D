
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameLoopService {
  private running = false;
  private lastTime = 0;
  private frameId = 0;
  private callback: ((dt: number) => void) | null = null;

  constructor(private zone: NgZone) {}

  start(callback: (dt: number) => void) {
    this.callback = callback;
    this.running = true;
    this.lastTime = performance.now();
    
    // Run outside Angular to prevent CD churn on every frame
    this.zone.runOutsideAngular(() => {
        this.loop();
    });
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  private loop = () => {
    if (!this.running) return;
    
    const now = performance.now();
    const dt = Math.min((now - this.lastTime), 100); // Cap at 100ms (10fps min) to prevent spirals
    this.lastTime = now;

    if (this.callback) this.callback(dt);

    this.frameId = requestAnimationFrame(this.loop);
  };
}
