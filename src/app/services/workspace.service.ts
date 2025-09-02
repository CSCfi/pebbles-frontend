import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { LifeCycleNote, Workspace, WorkspaceMember } from 'src/app/models/workspace';
import { buildConfiguration } from '../../environments/environment';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { Utilities } from "../utilities";

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
    const wms = this.accountService.getWorkspaceMemberships(userid);
    if (!wms) {
      return [];
    }
    // filter memberships by the manager role, map to workspaces and filter out non-existing (deleted)
    return wms.filter(wm => wm.is_manager).map(wm => {
      return this.getWorkspaceById(wm.workspace_id);
    }).filter(ws => ws != null);
  }

  getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return this.workspaceMemberMap.get(workspaceId);
  }

  hasExpired(workspace: Workspace): boolean {
    return Workspace.hasExpired(workspace);
  }

  getLifecycleNote(ws: Workspace): LifeCycleNote | null {
    if (!ws) {
      return null;
    }
    // ---- Check time gap since created
    if ( Math.abs(Utilities.getTimeGap(ws.create_ts * 1000, 'minute')) < 10) {
      return LifeCycleNote.New;
    }

    if (this.hasExpired(ws)) {
      return LifeCycleNote.Expired;
    }

    let daysLeft = Utilities.getTimeGap( new Date(ws.expiry_ts * 1000).getTime(), 'day');
    if (daysLeft <= 10) {
      return LifeCycleNote.ExpiringSoon;
    } else if (daysLeft <= 20) {
      return LifeCycleNote.Expiring;
    }

    return null;
  }

  joinWorkspace(joinCode: string): Observable<Workspace | string> {
    const url = `${buildConfiguration.apiUrl}/join_workspace/${joinCode}`;
    return this.http.put<Workspace>(url, {}).pipe(
      tap(resp => {
        this.fetchWorkspaces().subscribe();
        return resp;
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

        // default sorting: newest first
        resp = Workspace.sortWorkspaces(resp, ['create_ts']);

        // if the number of workspaces has changed or the contents are not the same,
        // we fire an event to notify listeners
        let eventNeeded = this.workspaces?.length !== resp.length;
        if (!eventNeeded) {
          // number of workspaces match, check if they are equal
          for (let i = 0; i < this.workspaces.length; i++) {
            if (!Workspace.equals(this.workspaces[i], resp[i])) {
              eventNeeded = true;
              break;
            }
          }
        }
        // assign fresh workspace data
        this.workspaces = resp;
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

  createWorkspace(name: string, description: string, expiry_ts = null, workspace_type = null): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces`;
    if (!expiry_ts) {
      expiry_ts = Math.floor(Date.now() / 1000 + 86400 * 30 * 3);
    }
    return this.http.post<Workspace>(url, {name, description, expiry_ts, workspace_type}).pipe(
      tap(()=> {
        this.fetchWorkspaces().subscribe();
        this.accountService.fetchWorkspaceMemberships(this.authService.getUserId()).subscribe();
      }),
    );
  }

  updateWorkspace(id: string, name: string, description: string, expiry_ts: number): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${id}`;
    return this.http.put<Workspace>(url, {name, description, expiry_ts}).pipe(
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
        this.accountService.fetchWorkspaceMemberships(this.authService.getUserId()).subscribe();
      })
    );
  }


  transferOwnership(workspaceId: string, userId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/transfer_ownership`;
    return this.http.patch(url, {new_owner_id: userId}).pipe(
      map(_ => {
        this.refreshWorkspaceMembers(workspaceId);
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

  regenerateJoinCode(workspaceId: string): Observable<Workspace> {
    const url = `${buildConfiguration.apiUrl}/workspaces/${workspaceId}/regenerate_join_code`;
    return this.http.post<Workspace>(url, {}).pipe(
      tap(_ => {
        this.fetchWorkspaces().subscribe();
      })
    );
  }

  isWorkspacePublic(workspaceId: string): boolean {
    const ws = this.getWorkspaceById(workspaceId);
    return ws.name.startsWith('System.');
  }
}
