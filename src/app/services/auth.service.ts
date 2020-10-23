import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { InstanceService } from 'src/app/services/instance.service';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  get isWorkspaceOwner(): boolean {
    return localStorage.getItem('is_workspace_owner') === 'true';
  }

  get isWorkspaceDetail(): boolean {
    return localStorage.getItem('is_workspace_manager') === 'true';
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private instanceService: InstanceService,
  ) {
  }

  login(user: User): Promise<any> {
    const url = `${buildConfiguration.apiUrl}/sessions`;
    return this.http.post(url, user).toPromise();
  }

  logout(): void {
    if (!confirm('Are you sure ?')) {
      return;
    }
    localStorage.clear();
    this.instanceService.clearPollingInterval();
    this.router.navigateByUrl('/').then(() => console.log('router: navigated to /'));
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
