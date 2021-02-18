import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstanceService } from './instance.service';
import { WorkspaceService } from './workspace.service';
import { Environment } from 'src/app/models/environment';
import { buildConfiguration } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements OnDestroy {

  private environments: Environment[] = [];
  private interval = 0;

  constructor(
    private http: HttpClient,
    private instanceService: InstanceService,
    private workspaceService: WorkspaceService,
    // private notificationService: NotificationService
  ) {
    this.interval = window.setInterval(() => {
      this.fetchEnvironments();
    }, 60 * 1000);

    // make sure we populate the service state in order to be able to assign the instances
    this.instanceService.fetchInstances().pipe(
      map( _ => {
        return this.workspaceService.fetchWorkspaces();
      }),
      map( _ => {
        return this.fetchEnvironments();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  get(environmentId: string): Environment {
    for (const environment of this.environments) {
      if (environment.id === environmentId) {
        return environment;
      }
    }
    return null;
  }

  getEnvironments(): Environment[] {
    return this.environments;
  }

  getEnvironmentsByWorkspaceId(workspaceId: string) {
    return this.environments.filter(env => env.workspace_id === workspaceId);
  }

  fetchEnvironments(): Observable<Environment[]> {
    const url = `${buildConfiguration.apiUrl}/environments`;

    return this.http.get<Environment[]>(url).pipe(
      map((resp) => {
        console.log('fetchEnvironments() got', resp);
        for (const newEnv of resp) {
          // make life easier by making some empty defaults if necessary
          if (!newEnv.config){
            newEnv.config = {};
          }
          if (!newEnv.labels) {
            newEnv.labels = [];
          }
          const instance = this.instanceService.getInstanceByEnvironmentId(newEnv.id);
          newEnv.instance_id = instance ? instance.id : null;
        }
        this.environments = resp;
        return this.environments;
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

  updateEnvironment(environment: Environment): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments/${environment.id}`;
    console.log('PUTting environment', environment);
    return this.http.put<Environment>(url, environment).pipe(
      map((resp) => {
        console.log('Updated environment' + resp);
        this.fetchEnvironments().subscribe();
        return environment;
      })
    );
  }
}
