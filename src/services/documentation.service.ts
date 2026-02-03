import { Injectable, signal } from '@angular/core';
import { GUIDE_REGISTRY } from '../data/guides/index';

export interface GuideStep {
  label: string;
  detail: string;
  icon: string;
}

export interface VisualArticle {
  id: string;
  title: string;
  humanLabel: string;
  category: 'core' | 'dynamics' | 'input';
  description: string;
  schemaId: 'movement' | 'physics' | 'input';
  steps: GuideStep[];
  simulationSceneId?: string;
}

/**
 * Reactive Content Provider for Engine Guidance.
 * [RUN_REF Optimization]: Data moved to src/data/guides/ for cache-efficiency and modularity.
 */
@Injectable({ providedIn: 'root' })
export class DocumentationService {
  readonly modules = GUIDE_REGISTRY;

  getModule(id: string): VisualArticle | undefined {
    return this.modules.find(m => m.id === id);
  }
}