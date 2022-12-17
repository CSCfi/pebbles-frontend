import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map, tap } from 'rxjs/operators';
import { AccountService } from './services/account.service';
import { ApplicationCategoryService } from './services/application-category.service';
import { ApplicationSessionService } from './services/application-session.service';
import { ApplicationService } from './services/application.service';
import { AuthService } from './services/auth.service';
import { EventService, LoginStatusChange } from './services/event.service';
import { PublicConfigService } from './services/public-config.service';
import { ServiceAnnouncementService } from './services/service-announcement.service';
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
    private accountService: AccountService,
    private serviceAnnouncementService: ServiceAnnouncementService,
  ) {
  }

  ngOnInit(): void {
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
    // public service announcements do not need authentication, fetch them right away
    this.serviceAnnouncementService.fetchServiceAnnouncements().subscribe();
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

    // Figure out if we are a workspace owner/manager. We do this at login also, but this way
    // users do not have to log out/in to get owner rights, a browser reload is enough.
    this.accountService.fetchWorkspaceAssociations(this.authService.getUserId()).pipe(
      tap(res => {
        let is_owner = false;
        let is_manager = false;
        res.forEach(wua => {
          is_owner = is_owner || wua.is_owner;
          is_manager = is_manager || wua.is_manager;
        });
        this.accountService.fetchAccount(this.authService.getUserId()).pipe(
          tap(res => {
            is_owner = is_owner || res.workspace_quota > 0;
            localStorage.setItem('is_workspace_owner', String(is_owner));
            localStorage.setItem('is_workspace_manager', String(is_manager));
          })
        ).subscribe();
      })
    ).subscribe();
  }
}
