import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Application } from 'src/app/models/application';
import { buildConfiguration } from '../../environments/environment';
import { ApplicationType } from '../models/application-template';
import { EventService } from './event.service';
import { ApplicationSessionService } from './application-session.service';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService implements OnDestroy {

  private applications: Application[] = null;
  private interval = 0;

  get isInitialized(): boolean {
    return this.applications !== null;
  }

  constructor(
    private http: HttpClient,
    private applicationSessionService: ApplicationSessionService,
    private eventService: EventService
  ) {
    this.interval = window.setInterval(() => {
      this.fetchApplications().subscribe();
    }, 6000 * 1000);

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
        this.fetchApplications().subscribe();
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

  isSharedFolderEnabled(app: Application|null, isPublic: boolean): boolean {
    // ---- If the application is Public
    if (isPublic) {
      return false;
    }
    // ----  Parameter 'app' is null when user opens form for application creation
    if( app===null ) {
      return true;
    }
    // ---- If object/key doesn't exist
    if ( !('shared_folder_enabled' in app.info) || app.info.shared_folder_enabled === null ) {
      return true;
    }
    return app.info.shared_folder_enabled;
  }

  getApplicationIcon(labels: string[]): IconProp {
    if (labels.includes('js') || labels.includes('javascript')) {
      return ['fab', 'js'];
    } else if (labels.includes('markup') || labels.includes('html')) {
      return ['fas', 'code'];
    } else if (labels.includes('linux') || labels.includes('command line')) {
      return ['fab', 'linux'];
    } else if (labels.includes('ai') || labels.includes('deep learning')) {
      return ['fas', 'brain'];
    } else if (labels.includes('machine learning')) {
      return ['fas', 'circle-nodes'];
    } else if (labels.includes('quantum computing')) {
      return ['fas', 'atom'];
    } else if (labels.includes('bio') || labels.includes('bio informatics')) {
      return ['fas', 'dna'];
    } else if (labels.includes('nlp') || labels.includes('natural language processing')) {
      return ['fas', 'language'];
    } else if (labels.includes('r') || labels.includes('rstudio')) {
      return ['fab', 'r-project'];
    } else if (labels.includes('data analytics') || labels.includes('data science') || labels.includes('analytics')) {
      return ['fas', 'chart-column'];
    } else if (labels.includes('python')) {
      return ['fab', 'python'];
    } else {
      return ['fas', 'book'];
    }
  }

  applicationTypeName(type: ApplicationType): string {
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
