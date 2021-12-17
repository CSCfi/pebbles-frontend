import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { ApplicationCategoryService } from './services/application-category.service';
import { ApplicationSessionService } from './services/application-session.service';
import { ApplicationService } from './services/application.service';
import { EventService, LoginStatusChange } from './services/event.service';
import { PublicConfigService } from './services/public-config.service';
import { WorkspaceService } from './services/workspace.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
  title = 'pebbles-frontend';
  private theme = 'user';

  @HostBinding('class')
  get themeMode() {
    return 'custom-theme-' + this.theme;
  }

  constructor(
    private workspaceService: WorkspaceService,
    private sessionService: ApplicationSessionService,
    private applicationService: ApplicationService,
    private applicationCategoryService: ApplicationCategoryService,
    private eventService: EventService,
    private authService: AuthService,
    private publicConfigService: PublicConfigService,
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    console.log('AppComponent.ngOnInit()');
    // Make sure we have current data loaded after login
    // populate the service states in order to be able to assign the sessions to applications
    this.eventService.loginStatus$.subscribe(change => {
      if (change === LoginStatusChange.login) {
        this.initializeServices();
      }
    });
    if (this.authService.getToken()) {
      this.initializeServices();
    }
    // public config endpoint does not need authentication, so we can set the title right away
    this.publicConfigService.fetchPublicConfig().subscribe(_ => {
      this.titleService.setTitle(this.publicConfigService.getInstallationName());
    });
  }

  initializeServices(): void {
    this.sessionService.fetchSessions().pipe(
      map(_ => {
        return this.workspaceService.fetchWorkspaces().subscribe();
      }),
      map(_ => {
        return this.applicationService.fetchApplications().subscribe();
      })
    ).subscribe();
    this.applicationCategoryService.fetchCategories().subscribe();
  }
}
