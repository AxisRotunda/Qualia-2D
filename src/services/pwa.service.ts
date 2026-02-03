
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt: any = null;
  
  // State Signals
  readonly isInstallable = signal(false);
  readonly isInstalled = signal(false);
  readonly isStandalone = signal(false);
  readonly isIframe = signal(false);
  readonly isBlob = signal(false);

  // Derived: Detailed Environment Status
  readonly environmentStatus = computed(() => {
    if (this.isBlob()) return 'Preview (Ephemeral)';
    if (this.isIframe()) return 'Sandboxed (Iframe)';
    if (this.isStandalone()) return 'Standalone App';
    return 'Browser (Tab)';
  });

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Detect Environment
      this.isIframe.set(window.self !== window.top);
      this.isStandalone.set(window.matchMedia('(display-mode: standalone)').matches);
      this.isInstalled.set(this.isStandalone());
      this.isBlob.set(window.location.protocol === 'blob:');

      // 2. Capture Install Prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default banner
        e.preventDefault();
        this.deferredPrompt = e;
        this.isInstallable.set(true);
        console.log('Qualia2D: PWA Install Prompt Captured');
      });

      // 3. Track Installation Completion
      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.isInstallable.set(false);
        this.isInstalled.set(true);
        console.log('Qualia2D: App Installed Successfully');
      });
    }
  }

  /**
   * Escapes the iframe sandbox by opening the current URL in a new window/tab.
   * This allows the browser to trigger 'beforeinstallprompt' for the applet.
   */
  popOut() {
    if (typeof window !== 'undefined' && !this.isBlob()) {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Requests native fullscreen for the document.
   * Used as a fallback for Blob/Preview environments where PWA install is impossible.
   */
  async toggleFullscreen() {
    if (typeof document === 'undefined') return;
    
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Qualia2D: Fullscreen request failed', err);
    }
  }

  async install() {
    if (!this.deferredPrompt) return;
    
    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`Qualia2D: Installation outcome: ${outcome}`);
    } catch (err) {
      console.error('Qualia2D: Installation failed', err);
    } finally {
      this.deferredPrompt = null;
      this.isInstallable.set(false);
    }
  }
}
