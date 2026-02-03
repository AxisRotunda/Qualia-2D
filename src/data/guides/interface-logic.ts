import { VisualArticle } from '../../services/documentation.service';

export const INTERFACE_LOGIC: VisualArticle = {
  id: 'tactile_link',
  title: 'Tactile Link',
  humanLabel: 'Interface Logic',
  category: 'input',
  description: 'The connection between user focus and entity state. Optimized for high-fidelity thumb and cursor interaction.',
  schemaId: 'input',
  steps: [
    { label: 'Direct Drive', detail: 'One-to-one stick to impulse mapping.', icon: 'M12 19V5M5 12l7-7 7 7' },
    { label: 'Kinetic Drag', detail: 'Physically pull nodes with pointer pressure.', icon: 'M7 7h10v10H7z' },
    { label: 'Pinch Zoom', detail: 'Linear scaling of the viewport observation plane.', icon: 'M15 3h6v6M9 21H3v-6' }
  ],
  simulationSceneId: 'arena'
};