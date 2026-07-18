import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VersionSwitchComponent } from './components/shared/version-switch/version-switch.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VersionSwitchComponent],
  template: `
    <router-outlet></router-outlet>
    <app-version-switch></app-version-switch>
  `,
})
export class AppComponent {
  name = 'frontend';
}
