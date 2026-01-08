import { Component, input } from '@angular/core';
import { EXAMPLE_COLOR } from './showcase-color-system';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
  standalone: false
})
export class ShowcaseComponent {
  code = input.required<string>();
  public colorEx = EXAMPLE_COLOR;
}
