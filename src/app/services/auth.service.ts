import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
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

  login(eppn: string, password: string): Promise<any> {
    const url = `${buildConfiguration.apiUrl}/sessions`;
    return this.http.post(url, {eppn, password}).toPromise();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
      console.log('router: navigated to /');
    });
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
