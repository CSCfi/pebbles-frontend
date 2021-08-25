import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/app/models/user';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private users: Map<string, User> = new Map();

  constructor(private http: HttpClient) {
  }

  get(userId: string): User {
    return this.users.get(userId);
  }

  fetchAccount(userId: string): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.get<User>(url).pipe(
      map(resp => {
        this.users.set(userId, resp);
        return resp;
      })
    );
  }
}
