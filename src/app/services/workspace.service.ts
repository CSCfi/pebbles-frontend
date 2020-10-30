import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Workspace } from 'src/app/models/workspace';
import { User } from 'src/app/models/user';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private userWorkspaces: Workspace[] = [];
  private ownerWorkspaces: Workspace[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.fetchWorkspaces().subscribe();
  }

  getUserWorkspaces(): Workspace[] {
    return this.userWorkspaces;
  }

  getOwnerWorkspaces(): Workspace[] {
    return this.userWorkspaces;
  }

  joinWorkspace(joinCode: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/workspace_join/${joinCode}`;
    return this.http.put(url, {}, this.httpOptions).pipe(
      tap(_ => {
        console.log(`join new workspace with the id=${joinCode}`);
        return joinCode;
      })
    );
  }

  exitWorkspace(workspaceId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/workspace_exit/${workspaceId}`;
    return this.http.put(url, this.httpOptions).pipe(
      tap( _ => {
        console.log(`exit form the workspace ${workspaceId}`);
        return workspaceId;
      })
    );
  }

  fetchWorkspaces(): Observable<Workspace[]>{
    const url = `${buildConfiguration.apiUrl}/workspaces/workspace_list_exit`;
    return this.http.get<Workspace[]>(url, this.httpOptions).pipe(
      map((resp) => {
        console.log('fetchWorkspaces got ' + resp);
        this.userWorkspaces = resp;
        return this.userWorkspaces;
      })
    );
  }

  fetchUserWorkspaces(): Observable<Workspace[]>{
    const url = `${buildConfiguration.apiUrl}/workspaces/workspace_list_exit`;
    return this.http.get<Workspace[]>(url, this.httpOptions).pipe(
      map((resp) => {
        console.log('fetchWorkspaces got ' + resp);
        this.userWorkspaces = resp;
        return this.userWorkspaces;
      })
    );
  }

  fetchOwnerWorkspaces(): Observable<Workspace[]>{
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.get<Workspace[]>(url, this.httpOptions).pipe(
      map((resp) => {
        console.log('fetchOwnerWorkspaces got ' + resp);
        this.ownerWorkspaces = resp;
        return this.ownerWorkspaces;
      })
    );
  }

  // ---- TODO: If I query with this.HTTP_OPTIONS, It returns error 400.
  fetchMembersByWorkspaceId(workspaceId: string): Observable<User[]> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/users`;
    return this.http.get<User[]>(url).pipe(
      map((resp) => {
        console.log('fetch Users' + resp);
        return resp;
      })
    );
  }
}
