# Qualia2D Engine

<div align="center">
  <img src="https://picsum.photos/800/200?grayscale" alt="Qualia2D Banner" style="border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
  <br><br>
  
  [![Angular](https://img.shields.io/badge/Angular-v21%2B-dd0031?style=flat-square&logo=angular)](https://angular.io)
  [![Zoneless](https://img.shields.io/badge/Runtime-Zoneless-6366f1?style=flat-square)](https://angular.dev)
  [![Physics](https://img.shields.io/badge/Physics-Rapier2D-f59e0b?style=flat-square)](https://rapier.rs)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
</div>

<br>

**Qualia2D** is the planar sibling of the Qualia3D engine. It is a high-performance, deterministic 2D game engine built on **Zoneless Angular** and **Rapier2D (WASM)**. It enforces a strict **ECS (Entity Component System)** architecture and utilizes **Angular Signals** for zero-overhead reactivity.

The visual language, **Obsidian Glass**, provides a data-dense, aerospace-grade HUD for the digital architect.

---

## ⚡ Core Architecture

### 1. Deterministic Planarity
Physics are simulated via **Rapier2D**, a Rust-based physics engine compiling to WASM. This ensures that every collision, impulse, and trajectory is deterministic and frame-rate independent.

### 2. Zoneless Reactivity
Qualia2D removes `zone.js`. State management is handled exclusively via **Signals**. The UI is a pure projection of the ECS state, updating only when specific data nodes emit changes.

### 3. Registry-Backed ECS
Entities are integers. Components are data structures stored in flat `Map` registries. Logic is decoupled into **Systems** (`PhysicsSystem`, `RenderSystem`, `ControllerSystem`) that iterate over component subsets.

---

## 📂 Project Hierarchy

The codebase is strictly organized to separate Logic, State, and View.

```bash
/src
├── app/ui/          # View Layer (Obsidian Glass Components)
├── data/            # Static Assets & Definitions
│   ├── scenes/      # Procedural Reality Fragments
│   ├── guides/      # Human Translation Modules
│   └── prefabs/     # Entity Templates
├── engine/          # The Simulation Core
│   ├── ecs/         # Component Store & Entities
│   ├── core/        # Physics, Camera, Asset Loader
│   └── systems/     # Logic Processors (Tick-based)
├── services/        # Orchestration Layer (Signals)
└── docs/            # The Knowledge Kernel
    ├── protocols/   # Operational Verbs (RUN_UI, RUN_PHYS)
    └── agent-ops/   # Context Packs for External AI
```

---

## 🎮 Operational Verbs

Qualia2D is governed by a set of semantic commands known as **QualiaVerbs**. These protocols ensure code mutations adhere to the engine's axial directives.

| Verb | Intent |
| :--- | :--- |
| `RUN_KNOWLEDGE` | Synchronize documentation and file mapping. |
| `RUN_REF` | Perform architectural refactors and modularization. |
| `RUN_REPAIR` | Execute stability patches based on error slugs. |
| `RUN_UI` | Audit and refine the Obsidian Glass interface. |
| `RUN_GUIDE_GEN` | Translate technical docs into human-readable guides. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- A modern browser with WASM support.

### Installation
```bash
npm install
npm start
```

### The Applet Environment
This engine is optimized for **Google AI Studio** and **Applet** environments. It supports:
- PWA Installation (`manifest.json`)
- Offline Caching (`service-worker.js`)
- Touch/Mobile Joypad Emulation

---

## 📖 Documentation
- [**The Manifesto**](./src/docs/qualia2d-manifesto.md): The philosophical vision.
- [**Agent Operations**](./src/docs/agent-ops/index.md): Instructions for AI Agents.
- [**Axial Directives**](./src/docs/kernel/axial-directives.md): The irreducible laws of the engine.

---

<div align="center">
  <sub>Designed for the Age of Agents.</sub>
</div>