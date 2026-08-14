import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconName, IconPrefix, IconProp } from '@fortawesome/fontawesome-svg-core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Application } from 'src/app/models/application';
import { buildConfiguration } from '../../environments/environment';
import { ApplicationType } from '../models/application-template';
import { Utilities } from '../utilities';
import { ApplicationSessionService } from './application-session.service';
import { EventService } from './event.service';


// Application icon from FontAwesome ('fa') or Material ('mat')
export type AppIcon =
  | { set: 'fa'; icon: IconProp }
  | { set: 'mat'; name: string };


@Injectable({
  providedIn: 'root'
})
export class ApplicationService implements OnDestroy {
  private http = inject(HttpClient);
  private applicationSessionService = inject(ApplicationSessionService);
  private eventService = inject(EventService);
  private iconLibrary = inject(FaIconLibrary);


  private applications: Application[] = null;
  private interval = 0;

  get isInitialized(): boolean {
    return this.applications !== null;
  }

  constructor() {
    this.interval = window.setInterval(() => {
      this.fetchApplications().subscribe();
    }, 60 * 1000);

    // we are interested in workspace updates, register and refresh our data if there are changes
    this.eventService.workspaceDataUpdate$.subscribe(_ => {
      this.fetchApplications().subscribe();
    });
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  get(applicationId: string): Application {
    return this.applications?.find(env => env.id === applicationId);
  }

  getApplications(): Application[] {
    return this.isInitialized ? this.applications : [];
  }

  getApplicationsByWorkspaceId(workspaceId: string): Application[] {
    return this.isInitialized ? this.applications.filter(env => env.workspace_id === workspaceId) : [];
  }

  getApplicationById(applicationId: string): Application {
    return this.get(applicationId);
  }

  fetchApplications(): Observable<Application[]> {
    const url = `${buildConfiguration.apiUrl}/applications`;

    return this.http.get<Application[]>(url).pipe(
      map((resp) => {
        for (const newEnv of resp) {
          // make life easier by making some empty defaults if necessary
          if (!newEnv.config) {
            newEnv.config = {};
          }
          if (!newEnv.labels) {
            newEnv.labels = [];
          }
          const session = this.applicationSessionService.getSessionByApplicationId(newEnv.id);
          newEnv.session_id = session ? session.id : null;
          if (!newEnv.application_type) {
            if (newEnv.labels.indexOf('jupyter') >= 0) {
              newEnv.application_type = ApplicationType.Jupyter;
            } else if (newEnv.labels.indexOf('rstudio') >= 0) {
              newEnv.application_type = ApplicationType.RStudio;
            } else {
              newEnv.application_type = ApplicationType.Generic;
            }
          }
        }
        this.applications = resp;
        this.eventService.applicationDataUpdate$.next('all');
        return this.applications;
      }),
      catchError(err => {
        if (err.status === 401) {
          this.clearPollingInterval();
        }
        return throwError('Error fetching applications');
      })
    );
  }

  startApplication(applicationId: string): Observable<Application> {
    const application = this.get(applicationId);
    return this.applicationSessionService.createSession(application.id).pipe(
      map(resp => {
        application.session_id = resp.id;
        this.applicationSessionService.fetchSessions().subscribe();
        return application;
      })
    );
  }

  // stopApplication(applicationId: string): Observable<Application> {
  //   const application = this.get(applicationId);
  //   return this.applicationSessionService.deleteSession(application.session_id).pipe(
  //     map(() => {
  //       this.applicationSessionService.fetchSessions().subscribe();
  //       return application;
  //     })
  //   );
  // }

  createApplication(
    workspace_id: string,
    name: string,
    description: string,
    template_id: string,
    labels: string[],
    maximum_lifetime: number,
    config: any,
    is_enabled: boolean
  ): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications`;
    return this.http.post<Application>(url,
      {workspace_id, name, description, labels, template_id, maximum_lifetime, config, is_enabled}).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  copyApplication(application: Application, targetWorkspaceId: string = null): Observable<Application> {
    let url = `${buildConfiguration.apiUrl}/applications/${application.id}/copy`;
    if (targetWorkspaceId) {
      url += `?workspace_id=${targetWorkspaceId}`
    }

    return this.http.put<Application>(url, null).pipe(
      map(_ => {
        this.fetchApplications().subscribe();
        return application;
      })
    );
  }

  updateApplication(application: Application): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications/${application.id}`;
    return this.http.put<Application>(url, application).pipe(
      map(_ => {
        this.fetchApplications().subscribe();
        return application;
      })
    );
  }

  // ---- TODO: discuss about the way to introduce
  deleteApplication(application: Application): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications/${application.id}`;
    return this.http.delete<Application>(url).pipe(tap(_ => {
      this.fetchApplications().subscribe();
    }));
  }

  clearPollingInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  isSharedFolderEnabled(app: Application | null, isPublic: boolean): boolean {
    // ---- If the application is Public
    if (isPublic) {
      return false;
    }
    // ----  Parameter 'app' is null when user opens form for application creation
    if (app === null) {
      return true;
    }
    // ---- If object/key doesn't exist
    if (!('shared_folder_enabled' in app.info) || app.info.shared_folder_enabled === null) {
      return true;
    }
    return app.info.shared_folder_enabled;
  }

  getApplicationIcon(labels: string[]): AppIcon {
    const icon = this.resolveApplicationIcon(labels);
    if (icon.set === 'fa') {
      const [prefix, name] = icon.icon as [IconPrefix, IconName];
      if (!this.iconLibrary.getIconDefinition(prefix, name)) {
        console.warn(`Application icon "${prefix} ${name}" is not registered; falling back to 'book'.`);
        return {set: 'fa', icon: ['fas', 'book']};
      }
    }
    return icon;
  }

  private resolveApplicationIcon(labels: string[]): AppIcon {
    const has = Utilities.labelMatcher(labels);
    if (has('js') || has('javascript')) {
      return {set: 'fa', icon: ['fab', 'js']};
    } else if (has('markup') || has('html')) {
      return {set: 'fa', icon: ['fas', 'code']};
    } else if (has('linux')) {
      return {set: 'fa', icon: ['fab', 'linux']};
    } else if (has('ai') || has('deep learning')) {
      return {set: 'fa', icon: ['fas', 'brain']};
    } else if (has('gis') || has('geo') || has('geospatial')) {
      return {set: 'fa', icon: ['fas', 'map-location-dot']};
    } else if (has('machine learning')) {
      return {set: 'fa', icon: ['fas', 'circle-nodes']};
    } else if (has('quantum computing')) {
      return {set: 'fa', icon: ['fas', 'atom']};
    } else if (has('bio') || has('bio informatics')) {
      return {set: 'fa', icon: ['fas', 'dna']};
    } else if (has('nlp') || has('natural language processing')) {
      return {set: 'fa', icon: ['fas', 'language']};
    } else if (has('r') || has('rstudio')) {
      return {set: 'fa', icon: ['fab', 'r-project']};
    } else if (has('data analytics') || has('data science') || has('analytics')) {
      return {set: 'fa', icon: ['fas', 'chart-column']};
    } else if (has('python')) {
      return {set: 'fa', icon: ['fab', 'python']};
    } else if (has('command') || has('terminal') || has('cli')) {
      // Material icon — clearer than the FontAwesome terminal glyph.
      return {set: 'mat', name: 'terminal'};
    } else {
      return {set: 'fa', icon: ['fas', 'book']};
    }
  }

  applicationTypeName(type: ApplicationType, labels: string[] = []): string {
    const has = Utilities.labelMatcher(labels);
    if (has('terminal')) {
      return 'Terminal';
    }
    if (has('vscode') || has('vs-code')) {
      return 'VSCode';
    }
    switch (type) {
      case 'jupyter':
        return 'Jupyter';
      case 'rstudio':
        return 'RStudio';
      default:
        return 'Generic';
    }
  }
}
