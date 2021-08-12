import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Workspace } from 'src/app/models/workspace';
import { User } from 'src/app/models/user';
import { WorkspaceUserList } from 'src/app/models/workspace-user-list';
import { Folder } from 'src/app/models/folder';
import * as TESTDATA from 'src/app/interceptors/test-data';
import { buildConfiguration } from '../../environments/environment';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private workspaces: Workspace[] = [];
  private workspaceMemberMap: Map<string, WorkspaceUserList> = new Map();
  private workspaceMemberCountMap: Map<string, number> = new Map();

  constructor(
    private http: HttpClient,
    private eventService: EventService
  ) {
  }

  getWorkspaceById(id: string): Workspace {
    return this.workspaces.find(x => x.id === id);
  }

  getWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  getOwnedWorkspaces(user: User): Workspace[] {
    // return workspaces where given user has owner role
    return this.workspaces.filter(x => x.owner_ext_id === user.ext_id);
  }

  getWorkspaceMembers(workspaceId: string): WorkspaceUserList {
    return this.workspaceMemberMap.get(workspaceId);
  }

  getWorkspaceMemberCount(workspaceId: string): number {
    return this.workspaceMemberCountMap.get(workspaceId);
  }

  // getManagedWorkspaces(user: User): Workspace[] {
  //   // return workspaces where given user has owner role
  //   // TODO fetch workspace associations and filter based on manager role
  //   return [];
  // }

  joinWorkspace(joinCode: string): Observable<Workspace | string> {
    const url = `${buildConfiguration.apiUrl}/join_workspace/${joinCode}`;
    return this.http.put<Workspace>(url, {}).pipe(
      tap(resp => {
        console.log(`joined workspace "${resp.name}" with code ${joinCode}`);
        this.fetchWorkspaces().subscribe();
        return resp;
      }),
      catchError(resp => {
        return of(resp.error.error);
      })
    );
  }

  exitWorkspace(workspaceId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/exit`;
    return this.http.put(url, {}).pipe(
      tap(_ => {
        console.log(`exited from workspace id "${workspaceId}"`);
        this.fetchWorkspaces().subscribe();
        return workspaceId;
      })
    );
  }

  fetchWorkspaces(): Observable<Workspace[]> {
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.get<Workspace[]>(url).pipe(
      map((resp) => {
        // if the number of workspaces has changed, we also fire an event (e.g. to notify EnvironmentService)
        const eventNeeded = this.workspaces.length !== resp.length;
        this.workspaces = resp.sort((a, b) => b.create_ts - a.create_ts);
        if (eventNeeded) {
          this.eventService.workspaceUpdate$.next('all');
        }
        return this.workspaces;
      })
    );
  }

  refreshWorkspaceMembers(workspaceId: string): void {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/list_users`;
    this.http.get<WorkspaceUserList>(url).pipe(
      map((resp) => {
        console.log('refreshWorkspaceMembers() got', resp);
        this.workspaceMemberMap.set(workspaceId, resp);
        this.eventService.workspaceUpdate$.next('all');
        return resp;
      })
    ).subscribe();

    // also refresh member count, some components are relying on that
    this.refreshWorkspaceMemberCount(workspaceId);
  }

  refreshWorkspaceMemberCount(workspaceId: string): void {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/list_users?members_count=true`;
    // const options = { params: new HttpParams().set('members_count', String(true))};
    this.http.get<number>(url).pipe(
      map((resp) => {
        console.log('refreshWorkspaceMemberCount() got', resp);
        this.workspaceMemberCountMap.set(workspaceId, resp);
        this.eventService.workspaceUpdate$.next('all');
        return Number(resp);
      })
    ).subscribe();
  }

  fetchFoldersByWorkspaceId(workspaceId: string): Observable<Folder[]> {
    const folders = TESTDATA.db.folders.filter(folder => {
      return folder.workspace_id === workspaceId;
    });
    return of(folders);
  }

  createWorkspace(name: string, description: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.post<Workspace>(url, {name, description}).pipe(
      map((resp) => {
        console.log('createWorkspace() got', resp);
        this.fetchWorkspaces().subscribe();
        return resp;
      })
    );
  }

  updateWorkspace(workspace: Workspace) {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspace.id}`;
    return this.http.put<Workspace>(url, {
      name: workspace.name,
      description: workspace.description,
      // join_code: workspace.join_code,
      // owner_ext_id: workspace.owner_ext_id,
      // role: null
      // user_config:{
      //     // banned_users: workspace.banned_users,
      //     managers: workspace.manager_ext_ids,
      //     owner:[{id: workspace.owner_ext_id}]
      //   }
    }).pipe(
      map(_ => {
        console.log('Updated Workspace');
        this.fetchWorkspaces().subscribe();
      })
    );
  }

  deleteWorkspace(workspaceId: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}`;
    return this.http.delete<Workspace>(url).pipe(tap(_ => {
      this.fetchWorkspaces().subscribe();
    }));
  }
}
