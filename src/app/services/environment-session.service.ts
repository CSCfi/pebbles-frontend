import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DesktopNotificationService } from 'src/app/services/desktop-notification.service';

import { EnvironmentSession, SessionStates } from 'src/app/models/environment-session';
import { buildConfiguration } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentSessionService implements OnDestroy {


  private environmentSessions: EnvironmentSession[] = [];
  private interval = 0;
  private intervalValue = -1;
  private lastUpdateTs = 0;

  constructor(
    private http: HttpClient,
    private desktopNotificationService: DesktopNotificationService,
    private authService: AuthService,
  ) {
    this.setPollingInterval(60 * 1000);
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  getSessions(): EnvironmentSession[] {
    // filter out environmentSessions that are shown by role (admin, owner, manager) but not owned
    return this.environmentSessions.filter(i => i.user_id === this.authService.getUserId());
  }

  getAllSessions(): EnvironmentSession[] {
    return this.environmentSessions;
  }

  getSession(id: string) {
    return this.environmentSessions.find(x => x.id === id);
  }

  getSessionByEnvironmentId(envId: string) {
    return this.getSessions().find(i => i.environment_id === envId);
  }

  fetchSessions(): Observable<EnvironmentSession[]> {

    const url = `${buildConfiguration.apiUrl}/environment_sessions`;

    return this.http.get<EnvironmentSession[]>(url).pipe(
      map(mySessions => {
        console.log('fetchSessions got', mySessions);
        let nonRunning = false;
        for (const inst of mySessions) {
          if (inst.state !== SessionStates.Running) {
            nonRunning = true;
            break;
          }
        }
        if (nonRunning) {
          this.setPollingInterval(4 * 1000);
        } else if (!nonRunning) {
          this.setPollingInterval(60 * 1000);
        }
        this.environmentSessions = mySessions;
        // show notifications for environmentSessions owned by the user, filtered in getSessions()
        this.desktopNotificationService.notifySessionLifetime(this.getSessions());
        // update the timestamp
        this.lastUpdateTs = Date.now();
        return this.environmentSessions;
      }),
      catchError(err => {
        console.log('SessionService.fetchSessions got error ', err);
        if (err.status === 401) {
          console.log('SessionService stopping session polling');
          this.clearPollingInterval();
        }
        return throwError('Error fetching environmentSessions');
      })
    );
  }

  createSession(environmentId: string): Observable<EnvironmentSession> {
    const url = `${buildConfiguration.apiUrl}/environment_sessions`;

    return this.http.post<EnvironmentSession>(url, {environment: environmentId}).pipe(
      tap(newSession => {
        // push the new session directly to state and trigger a full refresh later
        console.log('created session ' + newSession.name);
        this.environmentSessions.push(newSession);
        this.fetchSessions().subscribe();
      }));
  }

  deleteSession(sessionId: string): Observable<EnvironmentSession> {
    const url = `${buildConfiguration.apiUrl}/environment_sessions/${sessionId}`;
    return this.http.delete<EnvironmentSession>(url).pipe(tap(resp => {
      console.log(resp);
      this.fetchSessions().subscribe();
    }));
  }

  clearPollingInterval() {
    // console.log('---- stop polling');
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
      this.intervalValue = -1;
    }
  }

  getLastUpdateTs(): number {
    return this.lastUpdateTs;
  }

  private setPollingInterval(intervalMs: number) {
    // check if the value is already set
    if (this.intervalValue === intervalMs) {
      return;
    }
    console.log('setting polling rate to ' + intervalMs);

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    this.interval = window.setInterval(() => {
      this.fetchSessions().subscribe();
    }, intervalMs);
    this.intervalValue = intervalMs;
  }

}
