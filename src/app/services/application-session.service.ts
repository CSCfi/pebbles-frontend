import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApplicationSession, ApplicationSessionLog, SessionStates } from 'src/app/models/application-session';
import { DesktopNotificationService } from 'src/app/services/desktop-notification.service';
import { buildConfiguration } from '../../environments/environment';
import { AuthService } from './auth.service';
import { EventService } from "./event.service";


@Injectable({
  providedIn: 'root'
})
export class ApplicationSessionService implements OnDestroy {

  private applicationSessions: ApplicationSession[] = [];
  private interval = 0;
  private intervalValue = -1;
  private lastUpdateTs = 0;

  constructor(
    private http: HttpClient,
    private desktopNotificationService: DesktopNotificationService,
    private authService: AuthService,
    private eventService: EventService,
  ) {
    this.setPollingInterval(6000 * 1000);
  }

  get isInitialized(): boolean {
    return this.lastUpdateTs > 0;
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  getSessions(): ApplicationSession[] {
    // filter out applicationSessions that are shown by role (admin, owner, manager) but not owned
    return this.applicationSessions.filter(i => i.user_id === this.authService.getUserId());
  }

  getAllSessions(): ApplicationSession[] {
    return this.applicationSessions;
  }

  getSession(id: string) {
    return this.applicationSessions.find(x => x.id === id);
  }

  getSessionByApplicationId(appId: string) {
    return this.getSessions().find(i => i.application_id === appId);
  }

  fetchSessions(): Observable<ApplicationSession[]> {
    const url = `${buildConfiguration.apiUrl}/application_sessions`;
    return this.http.get<ApplicationSession[]>(url).pipe(
      map(sessions => {
        let nonStatic = false;
        for (const session of sessions) {
          if (session.state !== SessionStates.Running && session.state !== SessionStates.Failed) {
            nonStatic = true;
          }
          if (session.log_fetch_pending) {
            nonStatic = true;
          }
          if (session.session_data?.endpoints?.length) {
            session.url = session.session_data.endpoints[0].access;
          }
        }
        if (nonStatic) {
          this.setPollingInterval(4 * 1000);
        } else if (!nonStatic) {
          this.setPollingInterval(60 * 1000);
        }
        this.applicationSessions = sessions;
        // show notifications for applicationSessions owned by the user, filtered in getSessions()
        this.desktopNotificationService.notifySessionLifetime(this.getSessions());
        // update the timestamp
        this.lastUpdateTs = Date.now();
        return this.applicationSessions;
      }),
      catchError(err => {
        if (err.status === 401) {
          this.clearPollingInterval();
        }
        return throwError('Error fetching applicationSessions');
      })
    );
  }

  createSession(applicationId: string): Observable<ApplicationSession> {
    const url = `${buildConfiguration.apiUrl}/application_sessions`;

    return this.http.post<ApplicationSession>(url, {application_id: applicationId}).pipe(
      tap(newSession => {
        // push the new session directly to state and trigger a full refresh later
        this.applicationSessions.push(newSession);
        this.fetchSessions().subscribe();
      }));
  }

  deleteSession(sessionId: string): Observable<ApplicationSession> {
    const url = `${buildConfiguration.apiUrl}/application_sessions/${sessionId}`;
    return this.http.delete<ApplicationSession>(url).pipe(tap(_ => {
      this.fetchSessions().subscribe();
    }));
  }

  clearPollingInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
      this.intervalValue = -1;
    }
  }

  getLastUpdateTs(): number {
    return this.lastUpdateTs;
  }

  fetchApplicationSessionLogs(sessionId: string): Observable<ApplicationSessionLog[]> {
    const url = `${buildConfiguration.apiUrl}/application_sessions/${sessionId}/logs`;
    return this.http.get<ApplicationSessionLog[]>(url);
  }

  private setPollingInterval(intervalMs: number) {
    // check if the value is already set
    if (this.intervalValue === intervalMs) {
      return;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    this.interval = window.setInterval(() => {
      this.fetchSessions().subscribe();
    }, intervalMs);
    this.intervalValue = intervalMs;
  }

  requestLogFetch(sessionId: string): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/application_sessions/${sessionId}`;
    return this.http.patch<string>(
      url,
      {'log_fetch_pending': true}
    ).pipe(tap(resp => {
      this.getSession(sessionId).log_fetch_pending = true;
      this.fetchSessions().subscribe();
    }));
  }
}
