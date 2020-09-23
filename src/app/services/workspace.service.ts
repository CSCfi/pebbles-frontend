import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Workspace } from 'src/app/models/workspace';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private BASE_URL = 'http://localhost/api/v1';
  private workspaces: Workspace[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.fetchWorkspaces().subscribe();
  }

  getWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  joinWorkspace(joinCode: string): Observable<any> {
    const url = `${this.BASE_URL}/workspaces/workspace_join/${joinCode}`;
    return this.http.put(url, {}, this.httpOptions).pipe(
      tap(_ => {
        console.log(`join new workspace with the id=${joinCode}`);
        return joinCode;
      })
    );
  }

  exitWorkspace(workspaceId: string): Observable<any> {
    const url = `${this.BASE_URL}/workspaces/workspace_exit/${workspaceId}`;
    return this.http.put(url, this.httpOptions).pipe(
      tap( _ => {
        console.log(`exit form the workspace ${workspaceId}`);
        return workspaceId;
      })
    );
  }

  fetchWorkspaces(): Observable<Workspace[]>{
    const url = `${this.BASE_URL}/workspaces/workspace_list_exit`;
    return this.http.get<Workspace[]>(url, this.httpOptions).pipe(
      map((resp) => {
        console.log('fetchWorkspaces got ' + resp);
        this.workspaces = resp;
        return this.workspaces;
      })
    );
  }
}
