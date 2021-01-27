import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-header',
  templateUrl: './dashboard-content-header.component.html',
  styleUrls: ['./dashboard-content-header.component.scss']
})
export class DashboardContentHeaderComponent implements OnInit {

  @Input() content: any;
  @Input() isSearchOn: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
