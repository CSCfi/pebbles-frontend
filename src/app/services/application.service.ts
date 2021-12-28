import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
        console.log('fetchApplications() got', resp);
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
        console.log('ApplicationService.fetchApplications() got error ', err);
        if (err.status === 401) {
          console.log('ApplicationService stopping application polling');
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
        console.log('application starting, assigning session ' + resp);
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
  //       console.log('application stopping');
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
    console.log('POSTing a new application');
    return this.http.post<Application>(url,
      {workspace_id, name, description, labels, template_id, maximum_lifetime, config, is_enabled}).pipe(
      map((resp) => {
        console.log('created Application', resp);
        this.fetchApplications().subscribe();
        return resp;
      })
    );
  }

  copyApplication(application: Application): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications/application_copy/${application.id}`;

    return this.http.put<Application>(url, null).pipe(
      map(_ => {
        console.log('The Application copied');
        this.fetchApplications().subscribe();
        return application;
      })
    );
  }

  updateApplication(application: Application): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications/${application.id}`;
    console.log('updateApplication()', application);
    return this.http.put<Application>(url, application).pipe(
      map(_ => {
        console.log('application', application.id, 'updated');
        this.fetchApplications().subscribe();
        return application;
      })
    );
  }

  // ---- TODO: discuss about the way to introduce
  deleteApplication(application: Application): Observable<Application> {
    const url = `${buildConfiguration.apiUrl}/applications/${application.id}`;
    console.log('Deleting application', application);
    return this.http.delete<Application>(url).pipe(tap(_ => {
      console.log('application deleted:', application.id);
      this.fetchApplications().subscribe();
    }));
  }

  clearPollingInterval() {
    // console.log('---- stop polling');
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

}
