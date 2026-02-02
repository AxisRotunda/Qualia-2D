# [T1] Design Tokens: The Obsidian Matrix
ID: VISUAL_TOKENS_V1.0 | Role: Primitive Definitions.

## 1. COLOR PALETTE (SEMANTIC)
| Intent | Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Core** | Obsidian | `#020617` | Deepest background/base. |
| **Primary** | Electric Indigo | `#6366f1` | Creative verbs, Selection, Focus. |
| **Success** | Emerald | `#10b981` | Active Simulation, Valid State. |
| **Warning** | Amber | `#f59e0b` | Paused State, Soft Errors. |
| **Danger** | Rose | `#f43f5e` | Deletion, Hard Errors, Physics Overload. |
| **Surface** | Glass | `rgba(2, 6, 23, 0.6)` | Panel backgrounds. |

## 2. MATERIAL PROPERTIES
- **Blur Radius**: 
  - `Base`: 12px (Lower hierarchy).
  - `Panel`: 24px (Drawers, Modals).
  - `Hero`: 40px (Command Hub).
- **Border Intensity**: 
  - `Internal`: `border-white/5`.
  - `Active/High`: `border-white/10`.
  - `Selected`: `border-indigo-500/40`.

## 3. TYPOGRAPHY
- **System/UI**: `Inter, system-ui, sans-serif`.
  - `Header`: 700-900 Weight, tracking-tighter.
  - `Label`: 900 Weight, uppercase, tracking-widest, 9px-11px.
- **Data/Mono**: `JetBrains Mono, Fira Code, monospace`.
  - `Telemetry`: 700 Weight, 10px-12px.
  - `ID Fields`: 500 Weight, 9px.
