import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { ApplicationSession, ApplicationSessionLog, SessionStates } from 'src/app/models/application-session';
import { Application } from '../../models/application';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { ApplicationService } from '../../services/application.service';

export interface SessionProgressStep {
  index: number;
  state: string;
  message: string;
  percentage: number;
  isCurrent: boolean;
  isDone: boolean;
  isFailed: boolean;
  isStopped: boolean;
}

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss']
})
export class SessionPageComponent implements OnInit, OnDestroy {

  public context: Data;

  private progressMap = new Map<SessionStates, number>([
    [SessionStates.Queueing, 0],
    [SessionStates.Provisioning, 10],
    [SessionStates.Starting, 10],
    [SessionStates.Running, 100],
    [SessionStates.Deleting, 100],
    [SessionStates.Deleted, 100],
    [SessionStates.Failed, 100]
  ]);

  private provisioningLogProgressMap = new Map<string, number>([
    ['created', 20],
    ['scheduled to a node', 30],
    ['waiting for volumes', 40],
    ['pulling container image', 60],
    ['starting', 80],
    ['ready', 90]
  ]);

  private provisioningLogMessageMap = new Map<string, string>([
    ['created', 'Waiting in the queue'],
    ['scheduled to a node', 'Allocating resources'],
    ['waiting for volumes', 'Preparing folders'],
    ['pulling container image', 'Pulling container image'],
    ['starting', 'Starting session'],
    ['ready', 'Ready<br>Opening session']
  ]);

  public targetSession: ApplicationSession;
  public targetApplication: Application;
  private redirectUrl: string;
  private readonly sessionId: string;
  public sessionStatesInfo = '';
  public sessionProgressSteps: SessionProgressStep[];
  private sessionProcessFlag = false;
  public isSessionDeleted = false;
  private interval;
  public explanationMessage: String;

  @ViewChild('spinner') spinner: TemplateRef<any>;

  get description(): string {
    this.targetApplication = this.applicationService.get(this.targetSession.application_id);
    return this.targetApplication.description || 'No description';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private applicationSessionService: ApplicationSessionService,
    private titleService: Title,
  ) {
    this.sessionId = this.activatedRoute.snapshot.params.id;
    this.sessionProgressSteps = this.getSessionProgressSteps();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    // setup a timer to check the session state/progress
    this.interval = setInterval(() => {
      this.checkSessionStatus();
    }, 1000);
    // we are running in a new window, so we need to trigger sessionService
    this.applicationSessionService.fetchSessions().subscribe();
    this.applicationService.fetchApplications().subscribe();
  }

  ngOnDestroy(): void {
    // clean the interval
    if (this.interval !== 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  getSessionProgressSteps(): any[] {
    return Array.from(this.provisioningLogProgressMap.entries(), (step, i) => {
      return {
        index: i,
        state: step[0],
        message: this.provisioningLogMessageMap.get(step[0]),
        percentage: step[1],
        isCurrent: i === 0,
        isDone: false,
        isFailed: false
      };
    });
  }

  checkSessionStatus(): void {
    // this.step1.nativeElement.value('test');
    // assign application
    this.targetSession = this.applicationSessionService.getSessions().find((session) => {
      return (session.id === this.sessionId);
    });
    if (!this.targetSession) {
      this.sessionStatesInfo = 'Session is deleted';
      return;
    }
    this.sessionStatesInfo = 'Preparing your application session';
    this.targetApplication = this.applicationService.get(this.targetSession.application_id);
    // session service refreshes the sessions asynchronously, we can simply get the fresh ones

    // set the title of the tab if not set previously
    if (!this.titleService.getTitle().startsWith('Launching')) {
      this.titleService.setTitle('Launching ' + this.targetApplication.name);
    }

    // if our session state is 'running', proceed to redirection
    if (this.targetSession.state === SessionStates.Running) {
      const previousCurrent = this.sessionProgressSteps.find(step => step.isCurrent === true);
      this.progressBarAnimation(5, previousCurrent.index);
      clearInterval(this.interval);
      this.interval = 0;
      this.sessionStatesInfo = 'Ready!';
      setTimeout(() => {
        this.redirectToSession(this.targetSession);
      }, 1000);
    } else if (this.targetSession.state === SessionStates.Failed) {
      this.sessionFailed(false);
    } else if (this.targetSession.state === SessionStates.Deleted) {
      window.close();
    } else {
      this.sessionProcessFlag = true;
      this.applicationSessionService.fetchApplicationSessionLogs(this.targetSession.id).subscribe(
        (logs: ApplicationSessionLog[]) => {
          const lastMessage = logs[logs.length - 1]?.message;
          const current = this.sessionProgressSteps.find(step => step.state === lastMessage);
          const previousCurrent = this.sessionProgressSteps.find(step => step.isCurrent === true);
          if (current && previousCurrent) {
            this.progressBarAnimation(current.index, previousCurrent.index);
          }

          // figure out if there is a problem pulling the image and report it
          if (lastMessage == 'image could not be pulled') {
            this.explanationMessage = 'Container image for the application could not be pulled. ' +
              'This could be a misconfiguration or a temporary issue.';
            const pullStep = this.sessionProgressSteps.find(step => step.state === 'pulling container image');
            this.progressBarAnimation(pullStep.index, 0);
          }
          else {
            this.explanationMessage = null;
          }
        }, () => {
          this.sessionFailed(true);
        }
      );
    }
  }

  progressBarAnimation(currentIndex: number, previousCurrentIndex: number): void {
    if (currentIndex > previousCurrentIndex) {
      this.sessionProgressSteps.map(step => {
        if (step.index === previousCurrentIndex) {
          step.isCurrent = false;
          step.isDone = true;
        }
        if (step.index === previousCurrentIndex + 1) {
          step.isCurrent = true;
          if (step.index === 5) {
            step.isDone = true;
          }
        }
      });
      const nextStep = this.sessionProgressSteps.find(step => step.index === previousCurrentIndex + 1);
      this.progressBarAnimation(currentIndex, nextStep.index);
    }
  }

  sessionFailed(isDeleted: boolean): void {
    this.isSessionDeleted = isDeleted;
    const current = this.sessionProgressSteps.find(step => step.isCurrent === true);
    if (current && this.sessionProcessFlag) {
      this.sessionProgressSteps.map(step => {
        if (step.isCurrent === true) {
          step.isFailed = true;
        } else if (current.index < step.index) {
          step.isStopped = true;
        }
        return step;
      });
    } else {
      this.sessionProgressSteps.map(step => {
        step.isStopped = true;
        step.isCurrent = false;
      });
    }

    clearInterval(this.interval);
    this.interval = 0;
    this.sessionStatesInfo = isDeleted ? 'Session is deleted' : 'Session failed';
  }

  redirectToSession(session: ApplicationSession): void {
    this.redirectUrl = session.session_data.endpoints[0].access;
    window.open(this.redirectUrl, '_self');
  }
}
