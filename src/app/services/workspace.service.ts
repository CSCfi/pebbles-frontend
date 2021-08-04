import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Workspace } from 'src/app/models/workspace';
import { User } from 'src/app/models/user';
import { WorkspaceUserList } from 'src/app/models/workspace-user-list';
import { Folder } from 'src/app/models/folder';
import * as TESTDATA from 'src/app/interceptors/test-data';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private workspaces: Workspace[] = [];
  public workspaceDeletedSubject: Subject<string> = new Subject();
  public workspaceDeletedState = this.workspaceDeletedSubject.asObservable();
  public workspaceMemberSubject: Subject<string> = new Subject();
  public workspaceMemberState = this.workspaceMemberSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchWorkspaces().subscribe();
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

  // getManagedWorkspaces(user: User): Workspace[] {
  //   // return workspaces where given user has owner role
  //   // TODO fetch workspace associations and filter based on manager role
  //   return [];
  // }

  joinWorkspace(joinCode: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/join_workspace/${joinCode}`;
    return this.http.put<Workspace>(url, {}).pipe(
      tap( resp => {
        console.log(`joined workspace "${resp.name}" with code ${joinCode}`);
        return resp;
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
        // console.log('fetchWorkspaces() got', resp);
        for (const ws of resp) {
          // make life easier by making some empty defaults if necessary
          if (!ws.member_ext_ids) {
            ws.member_ext_ids = [];
          }
          if (!ws.manager_ext_ids) {
            ws.manager_ext_ids = [];
          }
        }
        this.workspaces = resp.sort((a, b) => b.create_ts - a.create_ts);
        return this.workspaces;
      })
    );
  }

  fetchMembersByWorkspaceId(workspaceId: string): Observable<WorkspaceUserList> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/list_users`;
    return this.http.get<WorkspaceUserList>(url).pipe(
      map((resp) => {
        console.log('fetchMembersByWorkspaceId() got', resp);
        return resp;
      })
    );
  }

  fetchMemberCountByWorkspaceId(workspaceId: string): Observable<number> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/list_users?members_count=true`;
    // const options = { params: new HttpParams().set('members_count', String(true))};
    return this.http.get<number>(url).pipe(
      map((resp) => {
        console.log('fetchMembersByWorkspaceId() got', resp);
        return Number(resp);
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
        // join_code: workspace.join_code,
        // owner_ext_id: workspace.owner_ext_id,
        // role: null
        // user_config:{
        //     // banned_users: workspace.banned_users,
        //     managers: workspace.manager_ext_ids,
        //     owner:[{id: workspace.owner_ext_id}]
        //   }
      }).pipe(
      map( _ => {
        console.log('Updated Workspace');
      })
    );
  }

  deleteWorkspace(workspaceId: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}`;
    return this.http.delete<Workspace>(url).pipe(tap(_ => {
      this.workspaceDeletedSubject.next(workspaceId);
    }));
  }

  reloadWorkspaceMembers(workspaceId: string): void {
    this.workspaceMemberSubject.next(workspaceId);
  }
}
