import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { EnvironmentSession, SessionStates } from 'src/app/models/environment-session';
import { EnvironmentService } from 'src/app/services/environment.service';
import { EnvironmentSessionService } from 'src/app/services/environment-session.service';
import { Utilities } from '../../../utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-session-button',
  templateUrl: './main-session-button.component.html',
  styleUrls: ['./main-session-button.component.scss']
})
export class MainSessionButtonComponent implements OnInit {

  @Input() environmentId: string;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  isWaitingInterval = false;
  diameter = 120;
  strokeWidth = 10;

  get isSpinnerOn(): boolean {
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

  get environment(): Environment {
    return this.environmentService.getEnvironmentById(this.environmentId);
  }

  get session(): EnvironmentSession {
    return this.environmentSessionService.getSession(this.environment.session_id);
  }

  get state(): SessionStates | null {
    if (this.session) {
      return this.session.state;
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
    const hours = Number(this.environment.maximum_lifetime) / 3600;
    const mins = Number(this.environment.maximum_lifetime) % 3600;
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
        const res = Number(this.session.lifetime_left) / Number(this.environment.maximum_lifetime) * 100;
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
    private environmentService: EnvironmentService,
    private environmentSessionService: EnvironmentSessionService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // console.log(this.environmentId);
  }

  startSession(): void {
    this.isWaitingInterval = true;
    const environmentSession = this.environmentSessionService.getSession(this.environment.session_id);
    this.environmentService.startEnvironment(this.environment.id).subscribe(_ => {
      if (environmentSession) {
        this.openSessionInBrowser();
      } else {
        setTimeout(() => {
          this.isWaitingInterval = false;
          this.openSessionInBrowser();
        }, 1600);
      }
    });
  }

  openSessionInBrowser(): void {
    const origin = this.document.location.origin;
    const url = origin + this.router.serializeUrl(
      this.router.createUrlTree(['/session/', this.environment.session_id])
    );
    if (!this.isWaitingInterval) {
      window.open(url, '_blank');
    }
    // this.router.navigateByUrl('/session/' + this.environment.session_id);
  }

  deleteSession(): void {
    // confirm deletion for non-failed sessions
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Delete environment session',
        dialogContent: this.environment.config?.enable_user_work_folder ?
          'Download all content you wish to save, or copy them to work folder before deleting the session. ' +
          'Do you want to continue?' :
          'Download all content you wish to save before deleting the session. ' +
          'Do you want to continue?',
        dialogActions: ['confirm', 'cancel']
      }
    }).afterClosed().subscribe(resp => {
      if (resp) {
        const environmentSession = this.environmentSessionService.getSession(this.environment.session_id);
        environmentSession.state = SessionStates.Deleting;
        // ---- Delete data for environmentSession-notification queue.
        localStorage.removeItem(environmentSession.name);

        this.environmentSessionService.deleteSession(environmentSession.id).subscribe(_ => {
          console.log('environmentSession deleting process finished');
        });
      }
    });
  }
}
