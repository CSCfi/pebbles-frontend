import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
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

  login(ext_id: string, password: string): Promise<any> {
    const url = `${buildConfiguration.apiUrl}/sessions`;
    return this.http.post(url, {ext_id, password}).toPromise();
  }

  logout(): void {
    localStorage.clear();
    console.log('redirecting to oauth2 sign out url');
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
