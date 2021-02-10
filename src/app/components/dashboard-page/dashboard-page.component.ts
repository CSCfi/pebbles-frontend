import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public isSideNavOpen = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
