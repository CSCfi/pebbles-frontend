import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public isSideNavOpen = true;
  private contentWidth: any;

  constructor() {
  }

  ngOnInit(): void {
    this.setSideNav();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSideNav();
  }

  setSideNav() {
    this.contentWidth = window.innerWidth;
    this.isSideNavOpen = localStorage.getItem('is_sidenav_open') === 'true';
    if (this.contentWidth < 1000) {
      this.isSideNavOpen = false;
    }else {
      if (localStorage.getItem('is_sidenav_open') !== 'false'){
        this.isSideNavOpen = true;
      }
    }
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    localStorage.setItem('is_sidenav_open', String(this.isSideNavOpen));
  }
}
