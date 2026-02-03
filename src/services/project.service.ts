import { Injectable, signal, inject, computed } from '@angular/core';
import { SCENES } from '../data/scene-presets';
import { ScenePreset2D } from '../engine/scene.types';
import { StorageService } from './storage.service';

export interface ProjectData {
  id: string;
  name: string;
  version: string;
  lastSceneId: string | null;
  created: number;
}

/**
 * [PROTOCOL_PROJECT] Project Service
 * Manages the high-level container for scenes and global settings.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private storage = inject(StorageService);

  readonly activeProject = signal<ProjectData | null>(null);
  
  // In a real implementation, this would be dynamic.
  // For the Applet, we treat the 'SCENES' constant as the project's content.
  readonly scenes = signal<ScenePreset2D[]>(SCENES);

  constructor() {
    this.loadDefaultProject();
  }

  private loadDefaultProject() {
    const saved = this.storage.load<ProjectData>('active_project', {
      id: 'default_project',
      name: 'Qualia2D Playground',
      version: '1.0.0',
      lastSceneId: null,
      created: Date.now()
    });
    this.activeProject.set(saved);
  }

  updateLastScene(sceneId: string) {
    this.activeProject.update(p => {
      if (!p) return null;
      const updated = { ...p, lastSceneId: sceneId };
      this.storage.save('active_project', updated);
      return updated;
    });
  }

  getSceneById(id: string): ScenePreset2D | undefined {
    return this.scenes().find(s => s.id === id);
  }
}