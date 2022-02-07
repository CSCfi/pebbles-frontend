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

  alerts: Alert[] = null;
  systemStatus: string = null;

  constructor(
    private http: HttpClient
  ) {
  }

  getSystemStatus(): string {
    return this.systemStatus;
  }

  getAlerts(): Alert[] {
    return this.alerts;
  }

  fetchSystemStatus(): Observable<string> {
    const url = `${buildConfiguration.apiUrl}/status`;
    return this.http.get<string>(url).pipe(
      map(resp => {
        this.systemStatus = resp;
        return resp;
      })
    );
  }

  fetchAlerts(): Observable<Alert[]> {
    const url = `${buildConfiguration.apiUrl}/alerts`;
    return this.http.get<Alert[]>(url).pipe(
      map(resp => {
        this.alerts = resp;
        return resp;
      })
    );
  }
}
