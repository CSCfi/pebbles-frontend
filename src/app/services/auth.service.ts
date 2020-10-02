import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { InstanceService } from 'src/app/services/instance.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://localhost/api/v1';

  get isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true' ? true : false;
  }

  get isWorkspaceOwner(): boolean {
    return localStorage.getItem('is_workspace_owner') === 'true' ? true : false;
  }

  get isWorkspaceManager(): boolean {
    return localStorage.getItem('is_workspace_manager') === 'true' ? true : false;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private instanceService: InstanceService,
  ) {
  }

  login(user: User): Promise<any> {
    const url = `${this.BASE_URL}/sessions`;
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
}
