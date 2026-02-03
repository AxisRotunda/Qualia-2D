
import { Component, AfterViewInit, inject, ViewChild } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService } from './services/engine-state-2d.service';
import { CommandRegistryService, QualiaVerb } from './services/command-registry.service';
import { Input2DService } from './services/input-2d.service';
import { PwaService } from './services/pwa.service';
import { DecimalPipe } from '@angular/common';
import { SCENES } from './data/scene-presets';

// Modular UI Imports
import { ViewportComponent } from './app/ui/viewport.component';
import { TelemetryComponent } from './app/ui/telemetry.component';
import { CommandHubComponent } from './app/ui/command-hub.component';
import { InspectorComponent } from './app/ui/inspector.component';
import { VirtualJoypadComponent } from './app/ui/virtual-joypad.component';
import { MainMenuComponent } from './app/ui/main-menu.component';
import { SceneBrowserOverlayComponent } from './app/ui/overlays/scene-browser.component';
import { CreateMenuOverlayComponent } from './app/ui/overlays/create-menu.component';
import { HierarchyComponent } from './app/ui/hierarchy.component';
import { EngineSettingsComponent } from './app/ui/engine-settings.component';
import { SelectionToolbarComponent } from './app/ui/selection-toolbar.component';

@Component({
  selector: 'app-root',
  imports: [
    DecimalPipe,
    ViewportComponent,
    TelemetryComponent,
    CommandHubComponent,
    InspectorComponent,
    VirtualJoypadComponent,
    MainMenuComponent,
    SceneBrowserOverlayComponent,
    CreateMenuOverlayComponent,
    HierarchyComponent,
    EngineSettingsComponent,
    SelectionToolbarComponent
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

  toggleCreateMenu() {
    this.input.reset(); 
    this.state.isCreateMenuOpen.update(v => !v);
  }

  toggleSceneBrowser() {
    this.input.reset();
    this.state.isSceneBrowserOpen.update(v => !v);
  }

  loadScene(id: string) {
    const scene = this.scenes.find(s => s.id === id);
    if (scene) {
      this.input.reset();
      this.engine.loadScene(scene);
      this.state.isSceneBrowserOpen.set(false);
    }
  }

  spawnEntity(templateId: string) {
    const t = this.engine.ecs.getTransform(this.engine.camera.followedEntityId() || 0);
    const x = t ? t.x : this.engine.camera.x();
    const y = t ? t.y + 2 : this.engine.camera.y() + 5;
    this.engine.spawnFromTemplate(templateId, x, y);
    this.state.isCreateMenuOpen.set(false);
    this.input.reset();
  }
}
