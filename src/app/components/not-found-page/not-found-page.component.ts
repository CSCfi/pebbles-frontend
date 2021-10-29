import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }
}
