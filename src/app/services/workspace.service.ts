import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserAssociationType, Workspace, WorkspaceMember } from 'src/app/models/workspace';
import { buildConfiguration } from '../../environments/environment';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private workspaces: Workspace[] = null;
  private workspaceMemberMap: Map<string, WorkspaceMember[]> = new Map();
  private workspaceMemberCountMap: Map<string, number> = new Map();

  get isInitialized(): boolean {
    return this.workspaces !== null;
  }

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private accountService: AccountService,
    private authService: AuthService,
  ) {
  }

  getWorkspaceById(id: string): Workspace {
    return this.isInitialized ? this.workspaces.find(x => x.id === id) : null;
  }

  getWorkspaces(): Workspace[] {
    return this.isInitialized ? this.workspaces : [];
  }

  getOwnedWorkspaces(user: User): Workspace[] {
    // return workspaces where given user has owner role
    return this.isInitialized ? this.workspaces.filter(x => x.owner_ext_id === user.ext_id) : [];
  }

  getManagedWorkspaces(userid: string): Workspace[] {
    if (!this.isInitialized) {
      return [];
    }
    const wuas = this.accountService.getWorkspaceAssociations(userid);
    if (!wuas) {
      return [];
    }
    // filter associations by the manager role, map to workspaces and filter out non-existing (deleted)
    return wuas.filter(wua => wua.is_manager).map(wua => {
      return this.getWorkspaceById(wua.workspace_id);
    }).filter(ws => ws != null);
  }

  getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return this.workspaceMemberMap.get(workspaceId);
  }

  getWorkspaceMemberCount(workspaceId: string): number {
    return this.workspaceMemberCountMap.get(workspaceId);
  }

  joinWorkspace(joinCode: string): Observable<Workspace | string> {
    const url = `${buildConfiguration.apiUrl}/join_workspace/${joinCode}`;
    return this.http.put<Workspace>(url, {}).pipe(
      tap(resp => {
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
        this.fetchWorkspaces().subscribe();
        return workspaceId;
      })
    );
  }

  fetchWorkspaces(): Observable<Workspace[]> {
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.get<Workspace[]>(url).pipe(
      map((resp) => {
        // if the number of workspaces has changed, we also fire an event (e.g. to notify ApplicationService)
        const eventNeeded = this.workspaces?.length !== resp.length;
        this.workspaces = resp;
        this.workspaces.sort((a, b) => b.create_ts - a.create_ts);
        this.workspaces.sort((a, b) => {
          return Object.values(UserAssociationType).indexOf(a.user_association_type)
            - Object.values(UserAssociationType).indexOf(b.user_association_type);
        });
        if (eventNeeded) {
          this.eventService.workspaceDataUpdate$.next('all');
        }
        return this.workspaces;
      })
    );
  }

  refreshWorkspaceMembers(workspaceId: string): void {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/members`;
    this.http.get<WorkspaceMember[]>(url).pipe(
      map((resp) => {
        this.workspaceMemberMap.set(workspaceId, resp);
        this.eventService.workspaceMemberDataUpdate$.next(workspaceId);
        return resp;
      })
    ).subscribe();

    // also refresh member count, some components are relying on that
    this.refreshWorkspaceMemberCount(workspaceId);
  }

  refreshWorkspaceMemberCount(workspaceId: string): void {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/members?member_count=true`;
    // const options = { params: new HttpParams().set('members_count', String(true))};
    this.http.get<number>(url).pipe(
      map((resp) => {
        this.workspaceMemberCountMap.set(workspaceId, resp);
        this.eventService.workspaceMemberDataUpdate$.next(workspaceId);
        return Number(resp);
      })
    ).subscribe();
  }

  createWorkspace(name: string, description: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    return this.http.post<Workspace>(url, {name, description}).pipe(
      tap((resp) => {
        this.fetchWorkspaces().subscribe();
        this.accountService.fetchWorkspaceAssociations(this.authService.getUserId()).subscribe();
      }),
    );
  }

  updateWorkspace(workspace: Workspace): Observable<Workspace> {
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
      tap(res => {
        this.eventService.workspaceDataUpdate$.next(res.id);
        this.fetchWorkspaces().subscribe();
      })
    );
  }

  deleteWorkspace(workspaceId: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}`;
    return this.http.delete<Workspace>(url).pipe(
      tap(_ => {
        this.workspaces = this.workspaces.filter(x => x.id !== workspaceId);
        this.eventService.workspaceDataUpdate$.next(workspaceId);
        this.accountService.fetchWorkspaceAssociations(this.authService.getUserId()).subscribe();
      })
    );
  }

  promoteMember(workspaceId: string, userId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/members`;
    return this.http.patch(url, {user_id: userId, operation: 'promote'}).pipe(
      map(_ => {
        this.refreshWorkspaceMembers(workspaceId);
      })
    );
  }

  demoteMember(workspaceId: string, userId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/members`;
    return this.http.patch(url, {user_id: userId, operation: 'demote'}).pipe(
      map(_ => {
        this.refreshWorkspaceMembers(workspaceId);
      })
    );
  }

  setIsBanned(workspaceId: string, userId: string, isBanned: boolean): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/members`;
    return this.http.patch(url,
      {
        user_id: userId,
        operation: isBanned ? 'ban' : 'unban'
      }).pipe(
      map(_ => {
        this.refreshWorkspaceMembers(workspaceId);
      })
    );
  }
}
