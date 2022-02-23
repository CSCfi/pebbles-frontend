import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public isSideNavOpen = true;
  private minWorkAreaWidth = 1250;

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setSideNav();
  }

  ngOnInit(): void {
    this.setSideNav();
  }

  setSideNav(): void {
    if (localStorage.getItem('is_sidenav_open') === 'true') {
      // ---- Auto close side-navigation
      this.isSideNavOpen = window.innerWidth > this.minWorkAreaWidth;
    } else {
      this.isSideNavOpen = false;
    }
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    localStorage.setItem('is_sidenav_open', String(this.isSideNavOpen));
  }
}
