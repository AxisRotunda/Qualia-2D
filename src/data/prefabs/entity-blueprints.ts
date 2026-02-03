export interface EntityTemplate {
  id: string;
  name: string;
  category: 'primitive' | 'dynamic' | 'force';
  icon: string;
}

/**
 * Registry of standard entity blueprints.
 * [RUN_REF]: Static definitions relocated to the data layer.
 */
export const ENTITY_TEMPLATES: EntityTemplate[] = [
  { 
    id: 'box_static', 
    name: 'Static Box', 
    category: 'primitive', 
    icon: 'M4 4h16v16H4z' 
  },
  { 
    id: 'box_dynamic', 
    name: 'Dynamic Box', 
    category: 'dynamic', 
    icon: 'M21 8V16L12 21L3 16V8L12 3L21 8Z' 
  },
  { 
    id: 'gravity_well', 
    name: 'Gravity Well', 
    category: 'force', 
    icon: 'M12 2v4m0 12v4M2 12h4m12 0h4' 
  },
  { 
    id: 'sensor_area', 
    name: 'Trigger Zone', 
    category: 'primitive', 
    icon: 'M12 3v18M3 12h18' 
  }
];
