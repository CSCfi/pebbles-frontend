import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { WorkspaceService } from '../../services/workspace.service';
import { EnvironmentService } from '../../services/environment.service';
import { InstanceService } from '../../services/instance.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public isSideNavOpen = true;
  private contentWidth: any;

  constructor(
    private workspaceService: WorkspaceService,
    private instanceService: InstanceService,
    private environmentService: EnvironmentService
  ) {
    workspaceService.fetchWorkspaces().subscribe();
  }

  ngOnInit(): void {
    this.setSideNav();

    // Make sure we have current data loaded at startup
    // populate the service states in order to be able to assign the instances to environments
    this.instanceService.fetchInstances().pipe(
      map( _ => {
        return this.workspaceService.fetchWorkspaces();
      }),
      map( _ => {
        return this.environmentService.fetchEnvironments();
      })
    ).subscribe();
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
