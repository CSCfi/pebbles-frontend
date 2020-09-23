import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {

  @Output() sendValue: EventEmitter<{ value: string }> = new EventEmitter<{ value: string }>();

  constructor() { }

  ngOnInit(): void {
  }

  sidenavToggle(): void {
    this.sendValue.emit({ value: 'hoge' });
  }

}
