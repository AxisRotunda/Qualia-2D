
import { Injectable, signal, inject, computed } from '@angular/core';
import { SCENES } from '../data/scene-presets';
import { ScenePreset2D, SceneConfig } from '../engine/scene.types';
import { StorageService } from './storage.service';
import { DEMO_REGISTRY } from '../data/demos/index';
import type { ControllerTopology } from './engine-state-2d.service';

export interface SceneOverride {
  env?: any;
  physics?: any;
  topology?: ControllerTopology;
}

export interface ProjectScene {
  id: string;
  name: string;
  templateId: string; // Maps to SCENES[].id
  created: number;
}

export interface ProjectData {
  id: string;
  name: string;
  version: string;
  lastSceneId: string | null;
  created: number;
  scenes: ProjectScene[]; // [REF_ARCH] Projects now own their scene list
  sceneOverrides: Record<string, SceneOverride>; 
}

/**
 * [PROTOCOL_PROJECT] Project Service V2.0
 * Manages the high-level container for scenes and global settings.
 * Enforces Project-Centric Scene Management (Scenes belong to Projects).
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

  // The Template Registry (Global "Prefabs" for Scenes)
  // We include Demos here so they can be used as templates too
  readonly templateRegistry = computed(() => {
     const demoScenes = DEMO_REGISTRY.map(d => d.scene);
     return [...SCENES, ...demoScenes];
  });

  constructor() {
    this.loadProjects();
  }

  private loadProjects() {
    let saved = this.storage.load<ProjectData[]>('project_registry', []);
    
    // [MIGRATION] V1 -> V2: Backfill 'scenes' array if missing
    if (saved.length > 0 && !saved[0].scenes) {
      console.log('Qualia2D: Migrating ProjectDB V1 -> V2');
      saved = saved.map(p => ({
        ...p,
        scenes: SCENES.map(s => ({ 
          id: s.id, // Keep original IDs for migration stability 
          name: s.name, 
          templateId: s.id, 
          created: Date.now() 
        }))
      }));
      this.storage.save('project_registry', saved);
    }

    if (saved.length === 0) {
      // Create Default "Playground" Project
      const defaultProject: ProjectData = {
        id: 'default_project',
        name: 'Qualia2D Playground',
        version: '2.0.0',
        lastSceneId: SCENES[0].id,
        created: Date.now(),
        scenes: SCENES.map(s => ({
           id: s.id,
           name: s.name,
           templateId: s.id,
           created: Date.now()
        })),
        sceneOverrides: {}
      };
      this.projects.set([defaultProject]);
      this.activeProjectId.set(defaultProject.id);
      this.saveRegistry();
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
      version: '2.0.0',
      lastSceneId: null,
      created: Date.now(),
      scenes: [],
      sceneOverrides: {}
    };
    
    // Add a default "Main" scene
    const defaultScene: ProjectScene = {
        id: `scene_${crypto.randomUUID().slice(0,8)}`,
        name: 'Main Fragment',
        templateId: 'playground', // Assumes 'playground' exists in SCENES
        created: Date.now()
    };
    newProject.scenes.push(defaultScene);
    newProject.lastSceneId = defaultScene.id;

    this.projects.update(list => [...list, newProject]);
    this.saveRegistry();
    this.selectProject(newProject.id);
  }

  createProjectFromDemo(demoId: string) {
    const demo = DEMO_REGISTRY.find(d => d.id === demoId);
    if (!demo) return;

    const newProject: ProjectData = {
      id: `proj_demo_${crypto.randomUUID().slice(0, 8)}`,
      name: `${demo.name} Copy`,
      version: '2.0.0',
      lastSceneId: null,
      created: Date.now(),
      scenes: [],
      sceneOverrides: {}
    };
    
    // Instantiate the Demo Scene as the Project's first scene
    const sceneId = `scene_${crypto.randomUUID().slice(0,8)}`;
    newProject.scenes.push({
        id: sceneId,
        name: demo.scene.name,
        templateId: demo.scene.id,
        created: Date.now()
    });
    newProject.lastSceneId = sceneId;

    // Persist Config
    if (demo.scene.config) {
       newProject.sceneOverrides[sceneId] = {
         env: demo.scene.config.env,
         physics: demo.scene.config.physics,
         topology: demo.scene.preferredTopology
       };
    }

    this.projects.update(list => [...list, newProject]);
    this.saveRegistry();
    this.selectProject(newProject.id);
  }

  deleteProject(id: string) {
    if (this.projects().length <= 1) return; 
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

  // --- SCENE MANAGEMENT ---

  addSceneToProject(templateId: string, name: string) {
    const projId = this.activeProjectId();
    if (!projId) return;

    const newScene: ProjectScene = {
        id: `scene_${crypto.randomUUID().slice(0, 8)}`,
        name: name,
        templateId: templateId,
        created: Date.now()
    };

    this.projects.update(list => list.map(p => {
        if (p.id === projId) {
            return { ...p, scenes: [...p.scenes, newScene] };
        }
        return p;
    }));
    this.saveRegistry();
  }

  deleteScene(sceneId: string) {
    const projId = this.activeProjectId();
    if (!projId) return;

    this.projects.update(list => list.map(p => {
        if (p.id === projId) {
            return { ...p, scenes: p.scenes.filter(s => s.id !== sceneId) };
        }
        return p;
    }));
    this.saveRegistry();
  }

  updateLastScene(sceneId: string) {
    this.projects.update(list => {
      return list.map(p => p.id === this.activeProjectId() ? { ...p, lastSceneId: sceneId } : p);
    });
    this.saveRegistry();
  }

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

  // --- RESOLUTION ---

  /**
   * Hydrates a ProjectScene (Metadata) into a Playable ScenePreset2D (Runtime).
   * Combines Template Logic + Project Data + Overrides.
   */
  resolveProjectScene(ps: ProjectScene): ScenePreset2D | null {
    const template = this.templateRegistry().find(t => t.id === ps.templateId);
    if (!template) return null;

    // Construct a new instance
    return {
        ...template,
        id: ps.id, // Project-Specific ID
        name: ps.name, // User-Defined Name
        // Config will be merged by SceneManager via getMergedSceneConfig
    };
  }

  getMergedSceneConfig(scene: ScenePreset2D): SceneConfig {
    const project = this.activeProject();
    
    // CoT: Calculate default topology based on the template preference
    const defaults = scene.config || { 
      env: { type: 'solid', background: '#020617', gridOpacity: 0.1 } 
    };
    
    // Ensure topology exists in defaults if not explicit
    if (!defaults.topology) {
        defaults.topology = scene.preferredTopology || 'platformer';
    }

    if (!project || !project.sceneOverrides[scene.id]) {
      return defaults as SceneConfig;
    }

    const override = project.sceneOverrides[scene.id];
    return {
      env: { ...defaults.env, ...override.env },
      physics: { ...defaults.physics, ...override.physics },
      topology: override.topology || defaults.topology // Merge topology
    } as SceneConfig;
  }

  private saveRegistry() {
    this.storage.save('project_registry', this.projects());
  }
}