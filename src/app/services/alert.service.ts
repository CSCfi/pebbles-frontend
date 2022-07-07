import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private http: HttpClient
  ) {
  }

  fetchSystemStatus(): Observable<string> {
    const url = `${buildConfiguration.apiUrl}/status`;
    return this.http.get<string>(url).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  fetchAlerts(showArchived:boolean = false, since_ts = 0): Observable<Alert[]> {
    let url = `${buildConfiguration.apiUrl}/alerts`;
    if (showArchived) {
      url += '?include_archived=1';
      if (since_ts) {
        url += '&since_ts='+since_ts;
      }
    }

    return this.http.get<Alert[]>(url).pipe(
      map(resp => {
        return resp;
      })
    );
  }
}
