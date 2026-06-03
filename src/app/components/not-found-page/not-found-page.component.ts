import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: false
})
export class NotFoundPageComponent {
  private location = inject(Location);


  goBack(): void {
    this.location.back();
  }
}
