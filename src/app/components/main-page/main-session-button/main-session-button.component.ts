import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Data, Router } from '@angular/router';
import { Application } from 'src/app/models/application';
import { ApplicationSession, SessionStates } from 'src/app/models/application-session';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { ApplicationService } from 'src/app/services/application.service';
import { Utilities } from '../../../utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-session-button',
  templateUrl: './main-session-button.component.html',
  styleUrls: ['./main-session-button.component.scss']
})
export class MainSessionButtonComponent {

  @Input() applicationId: string;
  @Input() context: Data;
  @Input() isSessionDeleted = false;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  isWaitingStartResponse = false;
  diameter = 120;
  strokeWidth = 10;
  sessionState: SessionStates;
  autoOpenTimer: number;

  get accessUrl(): string {
    return this.session.session_data?.endpoints?.[0]?.access;
  }

  get isSpinnerOn(): boolean {
    if (this.isWaitingStartResponse) {
      return true;
    }
    if (this.session) {
      switch (this.state) {
        case SessionStates.Running:
        case SessionStates.Deleted:
        case SessionStates.Failed:
          return false;
        default:
          return true;
      }
    }
    return false;
  }

  get application(): Application {
    return this.applicationService.getApplicationById(this.applicationId);
  }

  get session(): ApplicationSession {
    return this.applicationSessionService.getSession(this.application.session_id);
  }

  get state(): SessionStates | null {
    if (this.session) {
      return this.session.state;
    }
    if (this.context?.identifier === 'session') {
      window.close();
    }
    return null;
  }

  get isSessionActive(): boolean {
    return this.session && this.session.state !== SessionStates.Deleted;
  }

  get isTimeWarningOn(): boolean {
    return this.lifetimePercentage < 25 && !this.isSpinnerOn;
  }

  get lifetime(): string {
    const hours = Number(this.application.maximum_lifetime) / 3600;
    const mins = Number(this.application.maximum_lifetime) % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  get lifetimePercentage(): number {
    if (!this.session) {
      return 0;
    }
    switch (this.session.state) {
      case SessionStates.Deleted:
      case SessionStates.Deleting:
        return 0;
      case SessionStates.Queueing:
      case SessionStates.Provisioning:
      case SessionStates.Starting:
      case SessionStates.Failed:
        return 100;
      default:
        const res = Number(this.session.lifetime_left) / Number(this.application.maximum_lifetime) * 100;
        return Math.floor(res);
    }
  }

  get lifetimeLeft(): string {
    if (this.session.state === 'running' && this.session.lifetime_left) {
      return Utilities.lifetimeToString(this.session.lifetime_left);
    }
    return '';
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private applicationService: ApplicationService,
    private applicationSessionService: ApplicationSessionService,
    private dialog: MatDialog
  ) {
  }

  startSession(): void {
    const applicationSession = this.applicationSessionService.getSession(this.application.session_id);
    if (applicationSession) {
      this.openSessionInBrowser();
    }

    if (this.isWaitingStartResponse) {
      // there is already session being launched
      return;
    }
    this.isWaitingStartResponse = true;
    this.applicationService.startApplication(this.application.id).subscribe(_ => {
      this.isWaitingStartResponse = false;
      this.autoOpenTimer = window.setTimeout(() => {
        this.openSessionInBrowser();
      }, 1600);
    });
  }

  openSessionInBrowser(): void {
    const origin = this.document.location.origin;
    // check if the session is running and already has access url
    if (this.session.state === SessionStates.Running && this.accessUrl) {
      if (this.autoOpenTimer) {
        window.clearTimeout(this.autoOpenTimer);
      }
      window.open(this.accessUrl, '_blank');
    } else if (this.application?.session_id) {
      if (this.autoOpenTimer) {
        window.clearTimeout(this.autoOpenTimer);
      }
      const url = origin + this.router.serializeUrl(
        this.router.createUrlTree(['/session/', this.application.session_id])
      );
      window.open(url, '_blank');
    }
  }

  closeWindow(): void {
    window.close();
  }

  deleteSession(isFailed: boolean): void {
    // confirm deletion for non-failed sessions
    if (!isFailed) {
      this.dialog.open(DialogComponent, {
        width: '500px',
        autoFocus: false,
        data: {
          dialogTitle: 'Delete application session',
          dialogContent: this.application.config?.enable_user_work_folder ?
            'Download all content you wish to save, or copy them to work folder before deleting the session. ' +
            'Do you want to continue?' :
            'Download all content you wish to save before deleting the session. ' +
            'Do you want to continue?',
          dialogActions: ['confirm', 'cancel']
        }
      }).afterClosed().subscribe(resp => {
        if (resp) {
          this.proceedSessionDeletion();
        }
      });
    } else {
      // ---- To delete failed/deleted session
      this.proceedSessionDeletion();
    }
  }

  proceedSessionDeletion(): void {

    const applicationSession = this.applicationSessionService.getSession(this.application.session_id);
    applicationSession.state = SessionStates.Deleting;
    // ---- Delete data for applicationSession-notification queue.
    localStorage.removeItem(applicationSession.name);
    this.applicationSessionService.deleteSession(applicationSession.id).subscribe();
  }
}
