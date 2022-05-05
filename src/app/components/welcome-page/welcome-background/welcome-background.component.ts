import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-background',
  templateUrl: './welcome-background.component.html',
  styleUrls: ['./welcome-background.component.scss']
})
export class WelcomeBackgroundComponent {

  @Input() cube: number;

  constructor() { }

}
