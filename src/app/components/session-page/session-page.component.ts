import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnvironmentSession, SessionStates } from 'src/app/models/environment-session';
import { EnvironmentSessionService } from 'src/app/services/environment-session.service';
import { Environment } from '../../models/environment';
import { EnvironmentService } from '../../services/environment.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss']
})

export class SessionPageComponent implements OnInit, OnDestroy {

  progressMap = new Map<SessionStates, number>([
    [SessionStates.Queueing, 25],
    [SessionStates.Provisioning, 50],
    [SessionStates.Starting, 75],
    [SessionStates.Running, 100],
    [SessionStates.Deleting, 100],
    [SessionStates.Deleted, 100],
    [SessionStates.Failed, 100]
  ]);

  sessions: EnvironmentSession[];
  targetSession: EnvironmentSession;
  targetEnvironment: Environment;
  redirectUrl: string;
  iframeSrc: SafeResourceUrl;
  sessionId: string;
  sessionStates = SessionStates;
  progress = 0;
  private interval;

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'buffer';

  get description(): string {
    this.targetEnvironment = this.environmentService.get(this.targetSession.environment_id);
    return this.targetEnvironment.description || 'No description';
  }

  constructor(
    private route: ActivatedRoute,
    private sessionService: EnvironmentSessionService,
    private environmentService: EnvironmentService,
    public sanitizer: DomSanitizer
  ) {
    this.sessionId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    // setup a timer to check the session state/progress
    this.interval = setInterval(() => {
      this.checkSessionStatus();
    }, 1000);
    // we are running in a new window, so we need to trigger sessionService
    this.sessionService.fetchSessions().subscribe();
    this.environmentService.fetchEnvironments().subscribe();
  }

  ngOnDestroy(): void {
    // clean the interval
    if (this.interval !== 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  checkSessionStatus(): void {
    // assign environment
    this.targetSession = this.sessionService.getSessions().find((session) => {
      return (session.id === this.sessionId);
    });
    if (!this.targetSession) {
      console.log('session ' + this.sessionId + ' not found');
      return;
    }
    this.targetEnvironment = this.environmentService.get(this.targetSession.environment_id);
    // session service refreshes the sessions asynchronously, we can simply get the fresh ones
    console.log(this.targetSession.state);
    this.progress = this.progressMap.get(this.targetSession.state);

    // if our session state is 'running', proceed to redirection
    if (this.targetSession.state === SessionStates.Running) {
      clearInterval(this.interval);
      this.interval = 0;
      // ---- Chose way between (redirect|iFrame) to display an session
      this.redirectToSession(this.targetSession);
    }
  }

  redirectToSession(session: EnvironmentSession): void {
    this.redirectUrl = session.session_data.endpoints[0].access;
    console.log('redirecting to session content at ' + this.redirectUrl);
    window.open(this.redirectUrl, '_self');
  }

  frameSession(session: EnvironmentSession): void {
    // ---- To use iframe in Angular, it asks DomSanitizer helping preventing Cross Site Scripting Security bugs
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(session.session_data.endpoints[0].access);
    console.log('Overwrites iframe.src by' + this.iframeSrc);
  }
}
