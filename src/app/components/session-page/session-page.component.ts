import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { ApplicationSession, ApplicationSessionLog, SessionStates } from 'src/app/models/application-session';
import { Application } from '../../models/application';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { ApplicationService } from '../../services/application.service';
import { WorkspaceService } from "../../services/workspace.service";
import { Workspace } from "../../models/workspace";

export class SessionProgressStep {
  constructor(
    public index: number,
    public logEntry: string,
    public message: string,
    public longDurationMessage: string,
    public isCurrent?: boolean,
    public isDone?: boolean,
    public isFailed?: boolean,
    public isStopped?: boolean,
    public startTs?: number,
  ) {
  }
}

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss'],
  standalone: false
})
export class SessionPageComponent implements OnInit, OnDestroy {

  public context: Data;

  public targetSession: ApplicationSession;
  public targetApplication: Application;
  public targetWorkspace: Workspace;
  private redirectUrl: string;
  private readonly sessionId: string;
  public sessionStatesInfo = '';
  public sessionProgressSteps: SessionProgressStep[];
  private sessionProcessFlag = false;
  public isSessionDeleted = false;
  private interval: number;
  public explanationMessage = '';
  public warningMessage = '';

  @ViewChild('spinner') spinner: TemplateRef<any>;

  get description(): string {
    this.targetApplication = this.applicationService.get(this.targetSession.application_id);
    return this.targetApplication.description || 'No description';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private applicationSessionService: ApplicationSessionService,
    private workspaceService: WorkspaceService,
    private titleService: Title,
  ) {
    this.sessionId = this.activatedRoute.snapshot.params.id;
    this.sessionProgressSteps = this.createSessionProgressSteps();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    // set up a timer to check the session state/progress
    this.interval = window.setInterval(() => {
      this.checkSessionStatus();
    }, 1000);
    // we are running in a new window, so we need to trigger sessionService
    this.applicationSessionService.fetchSessions().subscribe();
    this.applicationService.fetchApplications().subscribe();
    this.workspaceService.fetchWorkspaces().subscribe();
  }

  ngOnDestroy(): void {
    // clean the interval
    if (this.interval !== 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  createSessionProgressSteps(): SessionProgressStep[] {
    return [
      {
        index: 0,
        logEntry: 'queuing',
        message: 'Waiting in the queue',
        longDurationMessage: 'Our backend seems to be slower than usual.',
        isCurrent: true,
      },
      {
        index: 1,
        logEntry: 'created',
        message: 'Allocating resources',
        longDurationMessage: 'We are trying to find free resources in our cluster.',
      },
      {
        index: 2,
        logEntry: 'waiting for volumes',
        message: 'Preparing folders',
        longDurationMessage: 'We are processing folders for your application session.',
      },
      {
        index: 3,
        logEntry: 'pulling container image',
        message: 'Pulling container image',
        longDurationMessage: 'We are pulling container image for your session. ' +
          'This can take a few minutes.',
      },
      {
        index: 4,
        logEntry: 'starting',
        message: 'Starting session',
        longDurationMessage: 'Session is starting up. If application downloads data from external sources ' +
          '(like GitHub) during startup, this can take a while.',
      },
      {
        index: 5,
        logEntry: 'ready',
        message: 'Ready<br>Opening session',
        longDurationMessage: 'If you are not redirected automatically, click "Open" button below',
      },
    ]
  }

  checkSessionStatus(): void {
    // first check if applicationSessionService has fetched data, so that we don't display false 'deleted' message
    if (!this.applicationSessionService.isInitialized) {
      return;
    }
    // assign session, application and workspace
    this.targetSession = this.applicationSessionService.getSessions().find((session) => {
      return (session.id === this.sessionId);
    });
    if (!this.targetSession) {
      this.sessionStatesInfo = 'Session is deleted';
      return;
    }
    this.sessionStatesInfo = 'Preparing your application session';
    this.targetApplication = this.applicationService.get(this.targetSession.application_id);

    this.targetWorkspace = this.workspaceService.getWorkspaceById(this.targetApplication.workspace_id);
    // set the title of the tab if not set previously
    if (!this.titleService.getTitle().startsWith('Launching')) {
      this.titleService.setTitle('Launching ' + this.targetApplication.name);
    }

    const activeStep = this.sessionProgressSteps.find(step => step.isCurrent);

    // first time? set the startTs to keep track how long we've been here
    if (!activeStep?.startTs) {
      activeStep.startTs = Date.now();
    }
    // if the step takes time, show some explanation
    if (Date.now() - activeStep?.startTs > 10 * 1000) {
      this.explanationMessage = activeStep.longDurationMessage;
    } else {
      this.explanationMessage = null;
    }
    // if our session state is 'running', proceed to redirection
    if (this.targetSession.state === SessionStates.Running) {
      this.animateProgressBar(this.sessionProgressSteps.length - 1);
      clearInterval(this.interval);
      this.interval = 0;
      this.sessionStatesInfo = 'Ready!';
      window.setTimeout(() => {
        this.redirectToSession(this.targetSession);
      }, 1000);
    } else if (this.targetSession.state === SessionStates.Failed) {
      this.sessionFailed(false);
    } else if (this.targetSession.state === SessionStates.Deleted) {
      window.close();
    } else {
      // process logs to get provisioning progress
      this.applicationSessionService.fetchApplicationSessionLogs(this.targetSession.id).subscribe(
        (logs: ApplicationSessionLog[]) => {
          this.sessionProcessFlag = true;
          const lastMessage = logs[logs.length - 1]?.message;
          const currentStep = this.sessionProgressSteps.find(step => step.logEntry === lastMessage);
          if (currentStep) {
            this.animateProgressBar(currentStep.index);
          }
          // figure out if there is a problem pulling the image and report it
          if (lastMessage == 'image could not be pulled') {
            this.warningMessage = 'Container image for the application could not be pulled. ' +
              'This could be a misconfiguration or a temporary issue.';
            const pullStep = this.sessionProgressSteps.find(step => step.logEntry === 'pulling container image');
            this.animateProgressBar(pullStep.index);
          }
        }, () => {
          this.sessionFailed(true);
        }
      );
    }
  }

  animateProgressBar(newIndex: number): void {
    const currentIndex = this.sessionProgressSteps.find(step => step.isCurrent === true).index;
    if (newIndex > currentIndex) {
      this.sessionProgressSteps.forEach(step => {
        if (step.index === currentIndex) {
          step.isCurrent = false;
          step.isDone = true;
        }
        if (step.index === currentIndex + 1) {
          step.isCurrent = true;
          if (step.index === this.sessionProgressSteps.length - 1) {
            step.isDone = true;
          }
        }
      });
      const nextStep = this.sessionProgressSteps.find(step => step.index === currentIndex + 1);
      this.animateProgressBar(newIndex);
    }
  }

  sessionFailed(isDeleted: boolean): void {
    this.isSessionDeleted = isDeleted;
    const currentStep = this.sessionProgressSteps.find(step => step.isCurrent === true);
    if (currentStep && this.sessionProcessFlag) {
      // highlight the failed step
      this.sessionProgressSteps.forEach(step => {
        if (step.isCurrent === true) {
          step.isFailed = true;
        } else if (currentStep.index < step.index) {
          step.isStopped = true;
        }
      });
    } else {
      // we don't know the failed step, so reset everything
      this.sessionProgressSteps.forEach(step => {
        step.isStopped = true;
        step.isCurrent = false;
      });
    }

    window.clearInterval(this.interval);
    this.interval = 0;
    this.sessionStatesInfo = isDeleted ? 'Session is deleted' : 'Session failed';
  }

  redirectToSession(session: ApplicationSession): void {
    this.redirectUrl = session.session_data.endpoints[0].access;
    window.open(this.redirectUrl, '_self');
  }
}
