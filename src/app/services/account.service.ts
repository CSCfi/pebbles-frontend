import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, WorkspaceUserAssociation } from 'src/app/models/user';
import { buildConfiguration } from '../../environments/environment';
import { EventService } from './event.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private users: User[] = null;
  private userMap: Map<string, User> = new Map();
  private workspaceUserAssociationMap: Map<string, WorkspaceUserAssociation[]> = new Map();

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
        console.log('fetchUsers() got', resp);
        resp.forEach( user => {
          this.userMap.set( user.id, user);
        });
        this.users = resp;
        this.eventService.userDataUpdate$.next();
        return resp;
      })
    ).subscribe();
  }

  removeUsers(selectedUsers) {
    const removedUsers = [];
    selectedUsers.forEach(user => {
      const url = `${buildConfiguration.apiUrl}/users/${user.id}`;
      this.http.delete<User[]>(url).pipe(map( _ => {
        this.users = this.users.map(x => {
          if (x.id === user.id) {
            x.is_deleted = true;
          } else {
            x.is_deleted = false;
          }
          return x;
        });
        this.eventService.userDataUpdate$.next();
        return this.users;
      })).subscribe();
    });
  }

  toggleBlockUser(userId: string, isBlocked: boolean): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.patch<User>(url, { is_blocked: !isBlocked }).pipe(tap( _ => {
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
    return this.http.patch<User>(url, {workspace_quota: value}).pipe(tap( resp => {
      this.users = this.users.map( user => {
        if (user.id === userId) {
          user.workspace_quota = resp.workspace_quota;
        }
        return user;
      });
    }));
  }

  getWorkspaceAssociations(userId: string): WorkspaceUserAssociation[] {
    const wuas = this.workspaceUserAssociationMap.get(userId);
    return wuas;
  }

  fetchWorkspaceAssociations(userId: string): Observable<WorkspaceUserAssociation[]> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}/workspace_associations`;
    return this.http.get<WorkspaceUserAssociation[]>(url).pipe(
      map((resp) => {
        console.log('fetchWorkspaceAssociations() got', resp);
        this.workspaceUserAssociationMap.set(userId, resp);
        return resp;
      }),
      tap(_ => this.eventService.userDataUpdate$.next())
    );
  }
}
