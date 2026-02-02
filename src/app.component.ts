
import { Component, AfterViewInit, inject, signal, ViewChild } from '@angular/core';
import { Engine2DService } from './services/engine-2d.service';
import { EngineState2DService } from './services/engine-state-2d.service';
import { CommandRegistryService, QualiaVerb } from './services/command-registry.service';
import { DecimalPipe } from '@angular/common';
import { SCENES } from './data/scene-presets';

// Modular UI Imports
import { ViewportComponent } from './app/ui/viewport.component';
import { TelemetryComponent } from './app/ui/telemetry.component';
import { CommandHubComponent } from './app/ui/command-hub.component';
import { InspectorComponent } from './app/ui/inspector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    DecimalPipe,
    ViewportComponent,
    TelemetryComponent,
    CommandHubComponent,
    InspectorComponent
  ],
  host: {
    'class': 'block h-full w-full select-none overflow-hidden touch-none',
  }
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ViewportComponent) viewport!: ViewportComponent;
  
  engine = inject(Engine2DService);
  state = inject(EngineState2DService);
  commands = inject(CommandRegistryService);
  
  scenes = SCENES;
  isCreateMenuOpen = signal(false);

  async ngAfterViewInit() {
    if (this.viewport) {
      await this.engine.init(this.viewport.getCanvas(), this.scenes[0]);
    }
  }

  runCommand(verb: QualiaVerb) {
    this.commands.execute(verb);
  }

  toggleCreateMenu() {
    this.isCreateMenuOpen.update(v => !v);
  }

  spawnEntity(templateId: string) {
    this.engine.spawnFromTemplate(templateId, this.state.cameraX(), this.state.cameraY() + 5);
    this.isCreateMenuOpen.set(false);
  }
}
