import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, WorkspaceMembership } from 'src/app/models/user';
import { buildConfiguration } from '../../environments/environment';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private users: User[] = null;
  private userMap: Map<string, User> = new Map();
  private workspaceMembershipMap: Map<string, WorkspaceMembership[]> = new Map();

  constructor(
    private http: HttpClient,
    private eventService: EventService,
  ) {
  }

  get(userId: string): User {
    return this.userMap.get(userId);
  }

  getUsers(): User[] {
    return this.users;
  }

  fetchAccount(userId: string): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.get<User>(url).pipe(
      map(resp => {
        this.userMap.set(userId, resp);
        return resp;
      })
    );
  }

  // TODO: refactor to refreshUsers, since we don't return an Observable
  fetchUsers() {
    const url = `${buildConfiguration.apiUrl}/users`;
    this.http.get<User[]>(url).pipe(
      map((resp) => {
        resp.forEach(user => {
          this.userMap.set(user.id, user);
        });
        this.users = resp;
        this.eventService.userDataUpdate$.next();
        return resp;
      })
    ).subscribe();
  }

  removeUsers(userIds: String[]) {
    userIds.forEach(userId => {
      const url = `${buildConfiguration.apiUrl}/users/${userId}`;
      this.http.delete<User[]>(url).pipe(tap(_ => {
        this.users.forEach((user) => {
          if (user.id === userId) {
            user.is_deleted = true;
          }
        });
        this.eventService.userDataUpdate$.next();
      })).subscribe();
    });
  }

  toggleBlockUser(userId: string, isBlocked: boolean): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.patch<User>(url, {is_blocked: !isBlocked}).pipe(tap(_ => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          user.is_blocked = !isBlocked;
        }
        return user;
      });
    }));
  }

  updateWorkspaceQuotas(userId: string, value: number): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.patch<User>(url, {workspace_quota: value}).pipe(tap(resp => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          user.workspace_quota = resp.workspace_quota;
        }
        return user;
      });
    }));
  }

  getWorkspaceMemberships(userId: string): WorkspaceMembership[] {
    const wms = this.workspaceMembershipMap.get(userId);
    return wms;
  }

  fetchWorkspaceMemberships(userId: string): Observable<WorkspaceMembership[]> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}/workspace_memberships`;
    return this.http.get<WorkspaceMembership[]>(url).pipe(
      map((resp) => {
        this.workspaceMembershipMap.set(userId, resp);
        return resp;
      }),
      tap(_ => this.eventService.userDataUpdate$.next())
    );
  }
}
