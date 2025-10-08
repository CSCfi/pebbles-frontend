import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-background',
  templateUrl: './welcome-background.component.html',
  styleUrls: ['./welcome-background.component.scss'],
  standalone: false
})
export class WelcomeBackgroundComponent {

  @Input() cube: number;

  constructor() {
  }

}
