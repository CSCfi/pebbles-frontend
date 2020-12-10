import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstanceService } from './instance.service';
import { WorkspaceService } from './workspace.service';
import { Environment } from 'src/app/models/environment';
import { buildConfiguration } from '../../environments/environment';
import { Workspace } from '../models/workspace';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private environments: Environment[] = [];
  private interval1 = 0;

  constructor(
    private http: HttpClient,
    private instanceService: InstanceService,
    private workspaceService: WorkspaceService,
    // private notificationService: NotificationService
  ) {
    this.interval1 = window.setInterval(() => {
      this.updateEnvironmentStatus();
    }, 30000);

    this.instanceService.fetchInstances().subscribe();
    this.workspaceService.fetchWorkspaces().subscribe();
    this.fetchEnvironments().subscribe();
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

  updateEnvironmentStatus(): void {
    // assign instances to environments
    for (const env of this.environments) {
      env.instance = this.instanceService.getInstances().find(inst => inst.environment_id === env.id);
      if (env.instance) {
        console.log(`found instance for environment "${env.name}"`);
        // this.notificationService.notifyInstanceLifetime(env.instance);
      }
    }
    // assign workspaces to environments
    for (const env of this.environments) {
      env.workspace = this.workspaceService.getWorkspaces().find(ws => ws.id === env.workspace_id);
      if (env.workspace) {
        console.log(`found workspace for environment "${env.name}"`);
      }
    }
  }

  fetchEnvironments(): Observable<Environment[]> {
    const url = `${buildConfiguration.apiUrl}/environments`;

    return this.http.get<Environment[]>(url).pipe(
      map((resp) => {
        console.log('fetchEnvironments() got', resp);
        // update existing envs
        for (const newEnv of resp) {
          if (!newEnv.config){
            newEnv.config = {};
          }
          newEnv.description = newEnv.config.description;
        }
        this.environments = resp;
        this.updateEnvironmentStatus();
        return this.environments;
      })
    );
  }

  startEnvironment(environmentId: string): Observable<Environment> {
    const environment = this.get(environmentId);
    return this.instanceService.createInstance(environment.id).pipe(
      map(resp => {
        console.log('environment starting, assigning instance ' + resp);
        environment.instance = resp;
        this.instanceService.fetchInstances().subscribe();
        return environment;
      })
    );
  }

  stopEnvironment(environmentId: string): Observable<Environment> {
    const environment = this.get(environmentId);
    return this.instanceService.deleteInstance(environment.instance.id).pipe(
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
    template_id: string,
    config: any,
    is_enabled?: boolean
  ): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments`;
    return this.http.post<Environment>(url, {workspace_id, name, template_id, config, is_enabled}).pipe(
      map((resp) => {
        console.log('created Environment' + resp);
        this.fetchEnvironments().subscribe();
        return resp;
      })
    );
  }

  updateEnvironment(environment: Environment): Observable<Environment> {
    const url = `${buildConfiguration.apiUrl}/environments/${environment.id}`;
    return this.http.put<Environment>(url, environment).pipe(
      map((resp) => {
        console.log('Updated environment' + resp);
        // patch the environment in our environment array for quick response
        const idx = this.environments.findIndex(i => i.id === environment.id);
        this.environments[idx] = environment;
        // fetch environments from backend to get the master
        this.fetchEnvironments().subscribe();
        return resp;
      })
    );
  }
}
