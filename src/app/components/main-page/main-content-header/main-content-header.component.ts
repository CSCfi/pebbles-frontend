import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-content-header',
  templateUrl: './main-content-header.component.html',
  styleUrls: ['./main-content-header.component.scss']
})
export class MainContentHeaderComponent implements OnInit {

  @Input() content: any;
  @Input() isSearchOn: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
