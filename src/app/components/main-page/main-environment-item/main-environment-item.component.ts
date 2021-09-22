
import { Component, Input, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { EnvironmentType } from '../../../models/environment-template';
import { Environment } from 'src/app/models/environment';
import { EnvironmentSession, SessionStates } from 'src/app/models/environment-session';
import { EnvironmentSessionService } from 'src/app/services/environment-session.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-environment-item',
  templateUrl: './main-environment-item.component.html',
  styleUrls: ['./main-environment-item.component.scss']
})
export class MainEnvironmentItemComponent implements OnInit {

  faBook = faBook;
  faRProject = faRProject;
  faPython = faPython;

  @Input() environment: Environment;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  isWaitingInterval = false;

  get isSpinnerOn(): boolean {
    const session = this.sessionService.getSession(this.environment.session_id);
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

  get session(): EnvironmentSession {
    return this.sessionService.getSession(this.environment.session_id);
  }

  get state(): SessionStates | null {
    if (this.session) {
      return this.session.state;
    }
    return null;
  }

  get labels(): string {
    return this.environment.labels.join(', ');
  }

  get isTimeWarningOn(): boolean {
    return (this.session?.state === SessionStates.Failed || this.lifetimePercentage < 25) && !this.isSpinnerOn;
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
    if (this.session.state === SessionStates.Running && this.session.lifetime_left) {
      return Utilities.lifetimeToString(this.session.lifetime_left);
    }
    return '';
  }

  get environmentType(): EnvironmentType {
    return this.environment?.environment_type;
  }

  get description(): string {
    if (this.environment && this.environment.description) {
      return this.environment.description;
    } else {
      return 'The environment has no description.';
    }
  }

  get isDraft(): boolean {
    return this.environment.is_enabled ? false : true;
  }

  constructor(
    private sessionService: EnvironmentSessionService,
  ) { }

  ngOnInit(): void {
  }
}
