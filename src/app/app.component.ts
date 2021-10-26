import { Component, HostBinding, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { EnvironmentCategoryService } from './services/environment-category.service';
import { EnvironmentService } from './services/environment.service';
import { EventService, LoginStatusChange } from './services/event.service';
import { EnvironmentSessionService } from './services/environment-session.service';
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
    private sessionService: EnvironmentSessionService,
    private environmentService: EnvironmentService,
    private environmentCategoryService: EnvironmentCategoryService,
    private eventService: EventService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    console.log('AppComponent.ngOnInit()');
    // Make sure we have current data loaded after login
    // populate the service states in order to be able to assign the sessions to environments
    this.eventService.loginStatus$.subscribe(change => {
      if (change === LoginStatusChange.login) {
        this.initializeServices();
      }
    });
    if (this.authService.getToken()) {
      this.initializeServices();
    }
  }

  initializeServices(): void {
    this.sessionService.fetchSessions().pipe(
      map(_ => {
        return this.workspaceService.fetchWorkspaces().subscribe();
      }),
      map(_ => {
        return this.environmentService.fetchEnvironments().subscribe();
      })
    ).subscribe();
    this.environmentCategoryService.fetchCategories().subscribe();
  }
}
