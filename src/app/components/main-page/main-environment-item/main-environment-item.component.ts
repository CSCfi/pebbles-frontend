
import { Component, Input, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { EnvironmentType } from '../../../models/environment-template';
import { Environment } from 'src/app/models/environment';
import { Instance, InstanceStates } from 'src/app/models/instance';
import { InstanceService } from 'src/app/services/instance.service';
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
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    if (instance) {
      switch (this.state) {
        case InstanceStates.Running:
        case InstanceStates.Deleted:
        case InstanceStates.Failed:
          return false;
        default:
          return true;
      }
    }
    return false;
  }

  get instance(): Instance {
    return this.instanceService.getInstance(this.environment.instance_id);
  }

  get state(): InstanceStates | null {
    if (this.instance) {
      return this.instance.state;
    }
    return null;
  }

  get labels(): string {
    return this.environment.labels.join(', ');
  }

  get isTimeWarningOn(): boolean {
    return (this.instance?.state === InstanceStates.Failed || this.lifetimePercentage < 25) && !this.isSpinnerOn;
  }

  get lifetime(): string {
    const hours = Number(this.environment.maximum_lifetime) / 3600;
    const mins = Number(this.environment.maximum_lifetime) % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  get lifetimePercentage(): number {
    if (!this.instance) {
      return 0;
    }
    switch (this.instance.state) {
      case InstanceStates.Deleted:
      case InstanceStates.Deleting:
        return 0;
      case InstanceStates.Queueing:
      case InstanceStates.Provisioning:
      case InstanceStates.Starting:
      case InstanceStates.Failed:
        return 100;
      default:
        const res = Number(this.instance.lifetime_left) / Number(this.environment.maximum_lifetime) * 100;
        return Math.floor(res);
    }
  }

  get lifetimeLeft(): string {
    if (this.instance.state === InstanceStates.Running && this.instance.lifetime_left) {
      return Utilities.lifetimeToString(this.instance.lifetime_left);
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
    private instanceService: InstanceService,
  ) { }

  ngOnInit(): void {
  }
}
