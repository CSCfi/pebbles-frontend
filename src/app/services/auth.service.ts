import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { EventService, LoginStatusChange } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private eventService: EventService
  ) {
  }

  get isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  get isWorkspaceOwner(): boolean {
    return localStorage.getItem('is_workspace_owner') === 'true';
  }

  get isWorkspaceManager(): boolean {
    return localStorage.getItem('is_workspace_manager') === 'true';
  }

  login(ext_id: string, password: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/sessions`;
    return this.http.post(url, {ext_id, password}).pipe(
      tap(_ => {
        // defer the event to the next tick so that localstorage is populated properly before the call
        window.setTimeout(() => this.eventService.loginStatus$.next(LoginStatusChange.login), 1);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.eventService.loginStatus$.next(LoginStatusChange.logout);
    window.open('/oauth2/sign_out?rd=%2F', '_self');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUserName(): string {
    return localStorage.getItem('user_name');
  }

  getUserId(): string {
    return localStorage.getItem('user_id');
  }
}
