import { Component, DOCUMENT, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Application } from 'src/app/models/application';
import { ApplicationSession, SessionStates } from 'src/app/models/application-session';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { ApplicationService } from 'src/app/services/application.service';
import { SystemNotificationService } from 'src/app/services/system-notification.service';
import { AuthService } from '../../../services/auth.service';
import { Utilities } from '../../../utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export type SessionButtonSize = 'L' | 'M';

// ---- Source for per-size dimensions fed to the mat-progress-spinner and the ring SVG,
// ---- which CSS can't drive. Purely visual sizing (e.g. icon size) lives in the SCSS.
interface SessionButtonSizeConfig {
  diameter: number;
  stroke: number;
}

const SESSION_BUTTON_SIZES: Record<SessionButtonSize, SessionButtonSizeConfig> = {
  L: {diameter: 114, stroke: 7},
  M: {diameter: 90, stroke: 6},
};

@Component({
  selector: 'app-main-session-button',
  templateUrl: './main-session-button.component.html',
  styleUrls: ['./main-session-button.component.scss'],
  standalone: false
})
export class MainSessionButtonComponent {
  private document = inject<Document>(DOCUMENT);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private applicationSessionService = inject(ApplicationSessionService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private systemNotificationService = inject(SystemNotificationService);


  @Input() applicationId: string;
  @Input() context: Data;
  @Input() isSessionDeleted = false;
  @Input() isWorkspaceExpired = false;
  @Input() size: SessionButtonSize = 'L';

  // ---- Setting of a spinner
  isWaitingStartResponse = false;
  autoOpenTimer: number;

  get diameter(): number {
    return SESSION_BUTTON_SIZES[this.size].diameter;
  }

  get strokeWidth(): number {
    return SESSION_BUTTON_SIZES[this.size].stroke;
  }

  get ringRadius(): number {
    return this.diameter / 2 - this.strokeWidth / 2;
  }

  get disabledLaunchButtonTooltip(): string {
    return this.isWorkspaceExpired ?
      'This workspace has expired.' :
      'You are allowed to launch two sessions simultaneously.' +
      ' If you want to launch another, please first delete an existing session.'
  }

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

  get isLaunchButtonDisabled(): boolean {
    if (this.isWorkspaceExpired) {
      return true;
    }
    if (this.isWaitingStartResponse) {
      return false;
    }
    return (!(this.applicationSessionService.getSessionCount() < 2 || this.authService.isAdmin));
  }

  get application(): Application {
    return this.applicationService.getApplicationById(this.applicationId);
  }

  get session(): ApplicationSession {
    return this.applicationSessionService.getSession(this.application.session_id);
  }

  get state(): SessionStates | null {
    return this.session ? this.session.state : null;
  }

  get isSessionActive(): boolean {
    return this.session && this.session.state !== SessionStates.Deleted;
  }

  get isOnSessionPage(): boolean {
    return this.context?.identifier === 'session';
  }

  get isSessionReady(): boolean {
    return this.state === SessionStates.Running;
  }

  get isTimeWarningOn(): boolean {
    return this.lifetimePercentage < 25 && !this.isSpinnerOn;
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
    if (this.session?.state === 'running' && this.session.lifetime_left) {
      return Utilities.lifetimeToString(this.session.lifetime_left);
    }
    return '';
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
    this.applicationService.startApplication(this.application.id).pipe(
      tap(_ => {
        this.isWaitingStartResponse = false;
        this.autoOpenTimer = window.setTimeout(() => {
          this.openSessionInBrowser();
        }, 1600);
      }),
      catchError(err => {
        // stop the spinner in case the API bounced us right back
        this.isWaitingStartResponse = false;
        throw err;
      })
    ).subscribe();
  }

  openSessionInBrowser(): void {
    const origin = this.document.location.origin;
    // check if the session is running and already has access url
    if (this.session.state === SessionStates.Running && this.accessUrl) {
      if (this.autoOpenTimer) {
        window.clearTimeout(this.autoOpenTimer);
      }
      // ---- On the session page reuse this tab; elsewhere open a new one.
      window.open(this.accessUrl, this.isOnSessionPage ? '_self' : '_blank');
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
    // ---- A successful close tears down this context.
    window.setTimeout(() => {
      if (!window.closed) {
        this.systemNotificationService.displayError(
          'This tab could not be closed automatically. Please close it manually.'
        );
      }
    }, 300);
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
    this.applicationSessionService.deleteSession(applicationSession.id).subscribe(() => {
      // ---- Let Close the tab when a session failed on the session page
      if (this.isOnSessionPage) {
        this.closeWindow();
      }
    });
  }
}
