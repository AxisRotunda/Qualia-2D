// CoT: Standardizing module resolution for native ESM environments.
// All imports must start with ./ or ../ and point to canonical hierarchy locations.
import { Component, AfterViewInit, inject, ViewChild } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService, ActiveOverlay } from './services/engine-state-2d.service';
import { CommandRegistryService, QualiaVerb } from './services/command-registry.service';
import { Input2DService } from './services/input-2d.service';
import { PwaService } from './services/pwa.service';
import { DecimalPipe } from '@angular/common';
import { SCENES } from './data/scene-presets';

// UI Imports: Re-anchored to hierarchy-approved nested folders
import { ViewportComponent } from './app/ui/viewport/viewport.component';
import { TelemetryComponent } from './app/ui/hud/telemetry.component';
import { CommandHubComponent } from './app/ui/hud/command-hub.component';
import { InspectorComponent } from './app/ui/panels/inspector.component';
import { SceneInspectorComponent } from './app/ui/panels/scene-inspector.component';
import { VirtualJoypadComponent } from './app/ui/hud/virtual-joypad.component';
import { MainMenuComponent } from './app/ui/main-menu/main-menu.component';
import { SceneBrowserOverlayComponent } from './app/ui/overlays/scene-browser.component';
import { CreateMenuOverlayComponent } from './app/ui/overlays/create-menu.component';
import { HierarchyComponent } from './app/ui/panels/hierarchy.component';
import { EngineSettingsComponent } from './app/ui/panels/engine-settings.component';
import { SelectionToolbarComponent } from './app/ui/hud/selection-toolbar.component';
import { PanelDrawerComponent } from './app/ui/panels/panel-drawer.component';
import { LogViewerComponent } from './app/ui/hud/log-viewer.component';
import { DialogOverlayComponent } from './app/ui/overlays/dialog-overlay.component';

@Component({
  selector: 'app-root',
  imports: [
    DecimalPipe,
    ViewportComponent,
    TelemetryComponent,
    CommandHubComponent,
    InspectorComponent,
    SceneInspectorComponent,
    VirtualJoypadComponent,
    MainMenuComponent,
    SceneBrowserOverlayComponent,
    CreateMenuOverlayComponent,
    HierarchyComponent,
    EngineSettingsComponent,
    SelectionToolbarComponent,
    PanelDrawerComponent,
    LogViewerComponent,
    DialogOverlayComponent
  ],
  templateUrl: './app.component.html',
  host: {
    'class': 'block h-full w-full select-none overflow-hidden touch-none',
  }
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ViewportComponent) viewport!: ViewportComponent;
  
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
  commands = inject(CommandRegistryService);
  input = inject(Input2DService);
  pwa = inject(PwaService);
  
  scenes = SCENES;

  async ngAfterViewInit() {
    if (this.viewport) {
      await this.engine.init(this.viewport.getCanvas(), this.scenes[0]);
    }
  }

  runCommand(verb: QualiaVerb) {
    this.commands.execute(verb);
  }

  toggleOverlay(overlay: ActiveOverlay) {
    this.input.reset();
    const current = this.state.activeOverlay();
    this.state.setOverlay(current === overlay ? 'none' : overlay);
  }

  loadScene(id: string) {
    const scene = this.scenes.find(s => s.id === id);
    if (scene) {
      this.input.reset();
      this.engine.loadScene(scene);
      this.state.setOverlay('none');
    }
  }

  spawnEntity(templateId: string) {
    this.engine.spawnAtCamera(templateId);
    this.state.setOverlay('none');
    this.input.reset();
  }
}