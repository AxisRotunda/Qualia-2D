import { Injectable, signal, inject, computed } from '@angular/core';
import { SCENES } from '../data/scene-presets';
import { ScenePreset2D, SceneConfig } from '../engine/scene.types';
import { StorageService } from './storage.service';

export interface SceneOverride {
  env?: any;
  physics?: any;
}

export interface ProjectData {
  id: string;
  name: string;
  version: string;
  lastSceneId: string | null;
  created: number;
  customScenes?: string[]; // IDs of scenes defined by user
  sceneOverrides: Record<string, SceneOverride>; // Persistent config per scene
}

/**
 * [PROTOCOL_PROJECT] Project Service
 * Manages the high-level container for scenes and global settings.
 * Supports multi-project persistence and configuration overrides.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private storage = inject(StorageService);

  readonly projects = signal<ProjectData[]>([]);
  readonly activeProjectId = signal<string | null>(null);

  readonly activeProject = computed(() => {
    const id = this.activeProjectId();
    return this.projects().find(p => p.id === id) || null;
  });

  // Combined registry: Presets + Dynamic Scene Data
  readonly availableScenes = signal<ScenePreset2D[]>(SCENES);

  constructor() {
    this.loadProjects();
  }

  private loadProjects() {
    const saved = this.storage.load<ProjectData[]>('project_registry', []);
    if (saved.length === 0) {
      // Create first default project
      const defaultProject: ProjectData = {
        id: 'default_project',
        name: 'Qualia2D Playground',
        version: '1.0.0',
        lastSceneId: SCENES[0].id,
        created: Date.now(),
        sceneOverrides: {}
      };
      this.projects.set([defaultProject]);
      this.activeProjectId.set(defaultProject.id);
      this.storage.save('project_registry', [defaultProject]);
    } else {
      this.projects.set(saved);
      const lastActive = this.storage.load<string | null>('last_active_project_id', saved[0].id);
      this.activeProjectId.set(lastActive);
    }
  }

  createProject(name: string) {
    const newProject: ProjectData = {
      id: `proj_${crypto.randomUUID()}`,
      name,
      version: '1.0.0',
      lastSceneId: SCENES[0].id,
      created: Date.now(),
      sceneOverrides: {}
    };
    this.projects.update(list => [...list, newProject]);
    this.saveRegistry();
    this.selectProject(newProject.id);
  }

  deleteProject(id: string) {
    if (this.projects().length <= 1) return; // Prevent deleting last project
    this.projects.update(list => list.filter(p => p.id !== id));
    if (this.activeProjectId() === id) {
      this.selectProject(this.projects()[0].id);
    }
    this.saveRegistry();
  }

  selectProject(id: string) {
    this.activeProjectId.set(id);
    this.storage.save('last_active_project_id', id);
  }

  updateLastScene(sceneId: string) {
    this.projects.update(list => {
      return list.map(p => p.id === this.activeProjectId() ? { ...p, lastSceneId: sceneId } : p);
    });
    this.saveRegistry();
  }

  /**
   * Persists runtime changes to scene configuration (Env, Physics) into the Project.
   */
  saveSceneOverride(sceneId: string, config: SceneConfig) {
    this.projects.update(list => {
      return list.map(p => {
        if (p.id === this.activeProjectId()) {
          const overrides = { ...p.sceneOverrides };
          overrides[sceneId] = config;
          return { ...p, sceneOverrides: overrides };
        }
        return p;
      });
    });
    this.saveRegistry();
  }

  /**
   * Merges static default config with project-specific overrides.
   */
  getMergedSceneConfig(scene: ScenePreset2D): SceneConfig {
    const project = this.activeProject();
    const defaults = scene.config || { 
      env: { type: 'solid', background: '#020617', gridOpacity: 0.1 } 
    };

    if (!project || !project.sceneOverrides[scene.id]) {
      return defaults as SceneConfig;
    }

    const override = project.sceneOverrides[scene.id];
    
    // Deep merge logic (simplified for Env/Physics)
    return {
      env: { ...defaults.env, ...override.env },
      physics: { ...defaults.physics, ...override.physics }
    } as SceneConfig;
  }

  private saveRegistry() {
    this.storage.save('project_registry', this.projects());
  }

  getSceneById(id: string): ScenePreset2D | undefined {
    return this.availableScenes().find(s => s.id === id);
  }
}