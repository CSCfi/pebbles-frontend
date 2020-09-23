import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://localhost/api/v1';

  constructor(
    private http: HttpClient,
    private router: Router
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
    this.router.navigateByUrl('/').then(() => console.log('router: navigated to /'));
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUserName(): string {
    return localStorage.getItem('user_name');
  }
}
