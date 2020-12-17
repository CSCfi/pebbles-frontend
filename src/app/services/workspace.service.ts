import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Workspace } from 'src/app/models/workspace';
import { User } from 'src/app/models/user';
import { Folder } from 'src/app/models/folder';
import * as TESTDATA from 'src/app/interceptors/test-data';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private workspaces: Workspace[] = [];

  constructor(private http: HttpClient) {
    this.fetchWorkspaces().subscribe();
  }

  getWorkspace(id: string): Workspace {
    return this.workspaces.find(x => x.id === id);
  }

  getWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  joinWorkspace(joinCode: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/join_workspace/${joinCode}`;
    return this.http.put<Workspace>(url, {}).pipe(
      tap( res => {
        console.log(`joined workspace "${res.name}" with code ${joinCode}`);
        return res;
      })
    );
  }

  exitWorkspace(workspaceId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/exit`;
    return this.http.put(url, {}).pipe(
      tap( _ => {
        console.log(`exited from workspace id "${workspaceId}"`);
        return workspaceId;
      })
    );
  }

  fetchWorkspaces(): Observable<Workspace[]>{
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.get<Workspace[]>(url).pipe(
      map((resp) => {
        console.log('fetchWorkspaces() got', resp);
        this.workspaces = resp;
        return this.workspaces;
      })
    );
  }

  fetchMembersByWorkspaceId(workspaceId: string): Observable<User[]> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/list_users`;
    return this.http.get<User[]>(url).pipe(
      map((resp) => {
        console.log('fetchMembersByWorkspaceId() got', resp);
        return resp;
      })
    );
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
        return resp;
      })
    );
  }

  updateWorkspace(workspace: Workspace){
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspace.id}`;
    return this.http.put<Workspace>(url, {
        name: workspace.name,
        description: workspace.description,
        // ---- For future use
        // join_code: workspace.join_code,
        // owner_eppn: workspace.owner_eppn,
        // role: null
        // user_config:{
        //     // banned_users: workspace.banned_users,
        //     managers: workspace.manager_eppns,
        //     owner:[{id: workspace.owner_eppn}]
        //   }
      }).pipe(
      map( _ => {
        console.log('Updated Workspace');
      })
    );
  }
}
