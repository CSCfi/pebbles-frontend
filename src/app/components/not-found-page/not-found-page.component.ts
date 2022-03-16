import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {

  constructor(
    private location: Location
  ) { }

  goBack(): void {
    this.location.back();
  }
}
