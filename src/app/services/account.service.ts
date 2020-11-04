import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/app/models/user';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private user: User;

  constructor(private http: HttpClient) { }

  fetchAccount(userId: string): Observable<User> {
    const url = `${buildConfiguration.apiUrl}/users/${userId}`;
    return this.http.get<User>(url).pipe(
      map(resp => {
        this.user = resp;
        return this.user;
      })
    );
  }

}
