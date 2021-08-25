import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Environment } from 'src/app/models/environment';
import { buildConfiguration } from '../../environments/environment';
import { EnvironmentType } from '../models/environment-template';
import { EventService } from './event.service';
import { InstanceService } from './instance.service';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements OnDestroy {

  private environments: Environment[] = null;
  private interval = 0;

  get isInitialized(): boolean {
    return this.environments !== null;
  }

  constructor(
    private http: HttpClient,
    private instanceService: InstanceService,
    private eventService: EventService
  ) {
    this.interval = window.setInterval(() => {
      this.fetchEnvironments().subscribe();
    }, 60 * 1000);

    // we are interested in workspace updates, register and refresh our data if there are changes
    this.eventService.workspaceDataUpdate$.subscribe(_ => {
      this.fetchEnvironments().subscribe();
    });
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  get(environmentId: string): Environment {
    return this.environments?.find(env => env.id === environmentId);
  }

  getEnvironments(): Environment[] {
    return this.isInitialized ? this.environments : [];
  }

  getEnvironmentsByWorkspaceId(workspaceId: string): Environment[] {
    return this.isInitialized ? this.environments.filter(env => env.workspace_id === workspaceId) : [];
  }

  getEnvironmentById(environmentId: string): Environment {
    return this.get(environmentId);
  }

  fetchEnvironments(): Observable<Environment[]> {
    const url = `${buildConfiguration.apiUrl}/environments`;

    return this.http.get<Environment[]>(url).pipe(
      map((resp) => {
        console.log('fetchEnvironments() got', resp);
        for (const newEnv of resp) {
          // make life easier by making some empty defaults if necessary
          if (!newEnv.config) {
            newEnv.config = {};
          }
          if (!newEnv.labels) {
            newEnv.labels = [];
          }
          const instance = this.instanceService.getInstanceByEnvironmentId(newEnv.id);
          newEnv.instance_id = instance ? instance.id : null;
          if (!newEnv.environment_type) {
            if (newEnv.labels.indexOf('jupyter') >= 0) {
              newEnv.environment_type = EnvironmentType.Jupyter;
            } else if (newEnv.labels.indexOf('rstudio') >= 0) {
              newEnv.environment_type = EnvironmentType.RStudio;
            } else {
              newEnv.environment_type = EnvironmentType.Generic;
            }
          }
        }
        this.environments = resp;
        this.eventService.environmentDataUpdate$.next('all');
        return this.environments;
      }),
      catchError(err => {
        console.log('EnvironmentService.fetchEnvironments() got error ', err);
        if (err.status === 401) {
          console.log('EnvironmentService stopping environment polling');
          this.clearPollingInterval();
        }
        return throwError('Error fetching environments');
      })
    );
  }

  startEnvironment(environmentId: string): Observable<Environment> {
    const environment = this.get(environmentId);
    return this.instanceService.createInstance(environment.id).pipe(
      map(resp => {
        console.log('environment starting, assigning instance ' + resp);
        environment.instance_id = resp.id;
        this.instanceService.fetchInstances().subscribe();
        return environment;
      })
    );
  }

  stopEnvironment(environmentId: string): Observable<Environment> {
    const environment = this.get(environmentId);
    return this.instanceService.deleteInstance(environment.instance_id).pipe(
      map(() => {
        console.log('environment stopping');
        this.instanceService.fetchInstances().subscribe();
        return environment;
      })
    );
  }

  createEnvironment(
    workspace_id: string,
    name: string,
    description: string,
    template_id: string,
    labels: string[],
    maximum_lifetime: number,
    config: any,
    is_enabled: boolean
  ): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments`;
    console.log('POSTing a new environment');
    return this.http.post<Environment>(url,
      {workspace_id, name, description, labels, template_id, maximum_lifetime, config, is_enabled}).pipe(
      map((resp) => {
        console.log('created Environment', resp);
        this.fetchEnvironments().subscribe();
        return resp;
      })
    );
  }

  copyEnvironment(environment: Environment): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments/environment_copy/${environment.id}`;

    return this.http.put<Environment>(url, null).pipe(
      map(_ => {
        console.log('The Environment copied');
        this.fetchEnvironments().subscribe();
        return environment;
      })
    );
  }

  updateEnvironment(environment: Environment): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments/${environment.id}`;
    console.log('updateEnvironment()', environment);
    return this.http.put<Environment>(url, environment).pipe(
      map(res => {
        console.log('environment', environment.id, 'updated');
        this.fetchEnvironments().subscribe();
        return environment;
      })
    );
  }

  // ---- TODO: discuss about the way to introduce
  deleteEnvironment(environment: Environment): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments/${environment.id}`;
    console.log('Deleting environment', environment);
    return this.http.delete<Environment>(url).pipe(tap(resp => {
      console.log('environment deleted:', environment.id);
      this.fetchEnvironments().subscribe();
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
