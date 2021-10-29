import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EnvironmentSession, EnvironmentSessionLog, SessionStates } from 'src/app/models/environment-session';
import { EnvironmentSessionService } from 'src/app/services/environment-session.service';
import { Environment } from '../../models/environment';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss']
})

export class SessionPageComponent implements OnInit, OnDestroy {

  progressMap = new Map<SessionStates, number>([
    [SessionStates.Queueing, 0],
    [SessionStates.Provisioning, 10],
    [SessionStates.Starting, 10],
    [SessionStates.Running, 100],
    [SessionStates.Deleting, 100],
    [SessionStates.Deleted, 100],
    [SessionStates.Failed, 100]
  ]);

  provisioningLogProgressMap = new Map<string, number>([
    ['created', 20],
    ['scheduled to a node', 30],
    ['pulling container image', 40],
    ['waiting for volumes', 60],
    ['starting', 80],
    ['ready', 90]
  ]);

  provisioningLogMessageMap = new Map<string, string>([
    ['created', 'Waiting to be scheduled']
  ]);

  sessions: EnvironmentSession[];
  targetSession: EnvironmentSession;
  targetEnvironment: Environment;
  redirectUrl: string;
  iframeSrc: SafeResourceUrl;
  sessionId: string;
  sessionStates = SessionStates;
  progress = 0;
  latestProvisioningLogMessage = 'Waiting in the queue';
  private interval;

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'buffer';

  get description(): string {
    this.targetEnvironment = this.environmentService.get(this.targetSession.environment_id);
    return this.targetEnvironment.description || 'No description';
  }

  constructor(
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
    private environmentSessionService: EnvironmentSessionService,
  ) {
    this.sessionId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    // setup a timer to check the session state/progress
    this.interval = setInterval(() => {
      this.checkSessionStatus();
    }, 1000);
    // we are running in a new window, so we need to trigger sessionService
    this.environmentSessionService.fetchSessions().subscribe();
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
    this.targetSession = this.environmentSessionService.getSessions().find((session) => {
      return (session.id === this.sessionId);
    });
    if (!this.targetSession) {
      console.log('session ' + this.sessionId + ' not found');
      return;
    }
    this.targetEnvironment = this.environmentService.get(this.targetSession.environment_id);
    // session service refreshes the sessions asynchronously, we can simply get the fresh ones
    console.log(this.targetSession.state);

    this.progress = Math.max(this.progressMap.get(this.targetSession.state), this.progress);
    if (this.provisioningLogProgressMap.get(this.latestProvisioningLogMessage)) {
      this.progress = Math.max(this.provisioningLogProgressMap.get(this.latestProvisioningLogMessage), this.progress);
    }

    // if our session state is 'running', proceed to redirection
    if (this.targetSession.state === SessionStates.Running) {
      clearInterval(this.interval);
      this.interval = 0;
      this.redirectToSession(this.targetSession);
    } else if (this.targetSession.state === SessionStates.Failed) {
      clearInterval(this.interval);
      this.interval = 0;
      this.latestProvisioningLogMessage = 'Session failed';
    } else {
      this.environmentSessionService.fetchEnvironmentSessionLogs(this.targetSession.id).subscribe(
        (logs: EnvironmentSessionLog[]) => {
          let lastMessage = logs[logs.length - 1].message;
          // check if we have a custom message mapping
          if (this.provisioningLogMessageMap.get(lastMessage)) {
            lastMessage = this.provisioningLogMessageMap.get(lastMessage);
          }
          this.latestProvisioningLogMessage = lastMessage;
        }
      );
    }
  }

  redirectToSession(session: EnvironmentSession): void {
    this.redirectUrl = session.session_data.endpoints[0].access;
    console.log('redirecting to session content at ' + this.redirectUrl);
    // window.open(this.redirectUrl, '_self');
  }
}
