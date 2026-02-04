export interface EntityBlueprint {
  id: string;
  name: string;
  description: string;
  category: 'primitive' | 'logistics' | 'structure' | 'hazard' | 'mechanism' | 'interactive';
  icon: string;
  complexity: number; // 1-10
  
  components: {
    sprite?: {
      color?: string;
      textureId?: string;
      width: number;
      height: number;
      layer?: number;
      opacity?: number;
    };
    physics?: {
      type: 'dynamic' | 'fixed';
      shape: 'cuboid' | 'ball';
      mass?: number;
      restitution?: number;
      friction?: number;
      linearDamping?: number;
      sensor?: boolean;
    };
    interaction?: {
      label: string;
      radius: number;
      triggerId: string;
    };
    forceField?: {
      strength: number;
      radius: number;
    };
    tags: string[];
  };
}

/**
 * Qualia2D Asset Database [v2.5]
 * Standardized sets for high-fidelity simulation and level design.
 */
export const BLUEPRINTS: EntityBlueprint[] = [
  // --- PRIMITIVES ---
  {
    id: 'prim_cube_std',
    name: 'Standard Cube',
    description: '1x1 unit mathematical primitive. Perfect for prototyping.',
    category: 'primitive',
    complexity: 1,
    icon: 'M4 4h16v16H4z',
    components: {
      sprite: { color: '#ffffff', width: 1, height: 1, layer: 1 },
      physics: { type: 'dynamic', shape: 'cuboid', mass: 1 },
      tags: ['primitive', 'cube']
    }
  },
  {
    id: 'prim_sphere_std',
    name: 'Standard Sphere',
    description: 'Spherical primitive with high rotational inertia.',
    category: 'primitive',
    complexity: 1,
    icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
    components: {
      sprite: { color: '#ffffff', width: 1, height: 1, layer: 1 },
      physics: { type: 'dynamic', shape: 'ball', mass: 1, restitution: 0.5 },
      tags: ['primitive', 'sphere']
    }
  },

  // --- LOGISTICS & PROPS ---
  {
    id: 'prop_crate_std',
    name: 'Std. Cargo Crate',
    description: 'Reinforced logistics container. Industry standard cargo.',
    category: 'logistics',
    complexity: 2,
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    components: {
      sprite: { textureId: 'tex_crate', width: 1, height: 1, layer: 2 },
      physics: { type: 'dynamic', shape: 'cuboid', mass: 5, friction: 0.6 },
      tags: ['prop', 'movable']
    }
  },
  {
    id: 'prop_toxic_barrel',
    name: 'Bio-Hazard Drum',
    description: 'Unstable hazardous material. Low friction, high mass.',
    category: 'logistics',
    complexity: 4,
    icon: 'M12 2v20M2 12h20',
    components: {
      sprite: { textureId: 'tex_toxic', width: 1, height: 1.4, layer: 2 },
      physics: { type: 'dynamic', shape: 'cuboid', mass: 12, friction: 0.1 },
      tags: ['hazard', 'explosive', 'prop']
    }
  },
  {
    id: 'prop_glass_pane',
    name: 'Reinforced Glass',
    description: 'Transparent structural element. High bounciness.',
    category: 'structure',
    complexity: 3,
    icon: 'M3 3h18v18H3z',
    components: {
      sprite: { textureId: 'tex_glass', width: 3, height: 0.2, layer: 1, opacity: 0.6 },
      physics: { type: 'fixed', shape: 'cuboid', restitution: 0.9 },
      tags: ['static', 'glass']
    }
  },

  // --- STRUCTURES ---
  {
    id: 'struct_wall_blast',
    name: 'Blast Barrier',
    description: 'Heavy reinforced plating for arena boundaries.',
    category: 'structure',
    complexity: 2,
    icon: 'M3 3h18v18H3zM5 5v14h14V5H5z',
    components: {
      sprite: { textureId: 'tex_wall', width: 2, height: 1, layer: 1 },
      physics: { type: 'fixed', shape: 'cuboid' },
      tags: ['static', 'wall']
    }
  },
  {
    id: 'struct_platform_kinetic',
    name: 'Kinetic Platform',
    description: 'Floating tech-surface with high-friction coating.',
    category: 'structure',
    complexity: 5,
    icon: 'M2 17l10 5 10-5M2 12l10 5 10-5',
    components: {
      sprite: { textureId: 'tex_platform', width: 4, height: 0.5, layer: 1 },
      physics: { type: 'fixed', shape: 'cuboid', friction: 1.0 },
      tags: ['static', 'platform']
    }
  },

  // --- MECHANISMS ---
  {
    id: 'mech_gravity_sink',
    name: 'Singularity Core',
    description: 'Localized gravitational well. Inward pull.',
    category: 'mechanism',
    complexity: 7,
    icon: 'M12 2v4m0 12v4M2 12h4m12 0h4',
    components: {
      sprite: { color: '#6366f1', width: 0.5, height: 0.5, layer: 2, opacity: 0.4 },
      forceField: { strength: 30, radius: 8 },
      physics: { type: 'fixed', shape: 'ball', sensor: true },
      tags: ['mechanism', 'gravity']
    }
  },
  {
    id: 'mech_repulsor',
    name: 'Repulsor Field',
    description: 'Area denial kinetic system. Outward push.',
    category: 'mechanism',
    complexity: 7,
    icon: 'M4.2 4.2l15.6 15.6M4.2 19.8L19.8 4.2',
    components: {
      sprite: { color: '#f43f5e', width: 0.5, height: 0.5, layer: 2, opacity: 0.4 },
      forceField: { strength: -45, radius: 6 },
      physics: { type: 'fixed', shape: 'ball', sensor: true },
      tags: ['mechanism', 'kinetic']
    }
  },
  {
    id: 'mech_omni_light',
    name: 'Omni Pillar',
    description: 'Ambient illumination node. No physical presence.',
    category: 'mechanism',
    complexity: 4,
    icon: 'M12 2a4 4 0 0 0-4 4v2H6v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8h-2V6a4 4 0 0 0-4-4z',
    components: {
      sprite: { color: '#f59e0b', width: 0.4, height: 1.5, layer: 3, opacity: 0.8 },
      physics: { type: 'fixed', shape: 'cuboid', sensor: true },
      tags: ['decor', 'light']
    }
  },

  // --- INTERACTIVE ---
  {
    id: 'int_terminal_data',
    name: 'Mainframe Uplink',
    description: 'Archival access point for reality fragments.',
    category: 'interactive',
    complexity: 5,
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4z',
    components: {
      sprite: { color: '#0ea5e9', width: 1.2, height: 1.8, layer: 1 },
      physics: { type: 'fixed', shape: 'cuboid' },
      interaction: { label: 'Query Database', radius: 3.0, triggerId: 'terminal_01' },
      tags: ['interactive', 'data']
    }
  }
];