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
  private contentWidth: any;

  constructor() {
  }

  ngOnInit(): void {
    this.setSideNav();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setSideNav();
  }

  setSideNav(): void {
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
