import { Component, OnInit } from '@angular/core';
import { onSideNavChange, onMainContentChange } from './dashboard-page.animations';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  animations: [onSideNavChange, onMainContentChange]
})
export class DashboardPageComponent implements OnInit {

  public isSideNavOpen = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
