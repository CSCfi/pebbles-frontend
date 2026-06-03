import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PublicConfigService } from "../../services/public-config.service";
import { ServiceAnnouncementService } from '../../services/service-announcement.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: false
})
export class MainPageComponent implements OnInit {
  serviceAnnouncementService = inject(ServiceAnnouncementService);
  publicConfigService = inject(PublicConfigService);


  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public isSideNavOpen = true;
  private minWorkAreaWidth = 1250;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setSideNav();
  }

  ngOnInit(): void {
    this.setSideNav();
    // Service announcements which needs authentication
    this.serviceAnnouncementService.fetchServiceAnnouncements().subscribe();
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
