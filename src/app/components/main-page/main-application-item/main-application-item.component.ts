
import { Component, Input, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { ApplicationType } from '../../../models/application-template';
import { Application } from 'src/app/models/application';
import { ApplicationSession, SessionStates } from 'src/app/models/application-session';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-application-item',
  templateUrl: './main-application-item.component.html',
  styleUrls: ['./main-application-item.component.scss']
})
export class MainApplicationItemComponent implements OnInit {

  faBook = faBook;
  faRProject = faRProject;
  faPython = faPython;

  @Input() application: Application;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  // isWaitingInterval = false;

  get isPublic(): boolean {
    return this.application.workspace_name.startsWith('System.');
  }

  get isWorkVolumeActive(): boolean {
    if (this.application.info?.work_folder_enabled) {
      return true;
    }
    return false;
  }

  get isSpinnerOn(): boolean {
    const session = this.sessionService.getSession(this.application.session_id);
    if (session) {
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

  get session(): ApplicationSession {
    return this.sessionService.getSession(this.application.session_id);
  }

  get state(): SessionStates | null {
    if (this.session) {
      return this.session.state;
    }
    return null;
  }

  get labels(): string {
    return this.application.labels.join(', ');
  }

  get isTimeWarningOn(): boolean {
    return (this.session?.state === SessionStates.Failed || this.lifetimePercentage < 25) && !this.isSpinnerOn;
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
    if (this.session.state === SessionStates.Running && this.session.lifetime_left) {
      return Utilities.lifetimeToString(this.session.lifetime_left);
    }
    return '';
  }

  get applicationType(): ApplicationType {
    return this.application?.applicationType;
  }

  get description(): string {
    if (this.application && this.application.description) {
      return this.application.description;
    } else {
      return 'The application has no description.';
    }
  }

  get isDraft(): boolean {
    return this.application.is_enabled ? false : true;
  }

  constructor(
    private sessionService: ApplicationSessionService,
  ) { }

  ngOnInit(): void {
  }
}
