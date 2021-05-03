import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { Instance, InstanceStates } from 'src/app/models/instance';
import { EnvironmentService } from 'src/app/services/environment.service';
import { InstanceService } from 'src/app/services/instance.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-instance-button',
  templateUrl: './main-instance-button.component.html',
  styleUrls: ['./main-instance-button.component.scss']
})
export class MainInstanceButtonComponent implements OnInit {

  @Input() environmentId: string;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  isWaitingInterval = false;
  diameter = 110;
  strokeWidth = 6;

  get isSpinnerOn(): boolean {
    if (this.instance) {
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

  get environment(): Environment {
    return this.environmentService.getEnvironmentById(this.environmentId);
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

  get isInstanceActive(): boolean {
    return this.instance && this.instance.state !== InstanceStates.Deleted;
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
    if (this.instance.state === 'running' && this.instance.lifetime_left) {
      return Utilities.lifetimeToString(this.instance.lifetime_left);
    }
    return '';
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private environmentService: EnvironmentService,
    private instanceService: InstanceService,
  ) {}

  ngOnInit(): void {
    // console.log(this.environmentId);
  }

  startEnvironment(): void {
    this.isWaitingInterval = true;
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    this.environmentService.startEnvironment(this.environment.id).subscribe(_ => {
      if (instance) {
        this.openEnvironmentInBrowser();
      } else {
        setTimeout(() => {
          this.isWaitingInterval = false;
          this.openEnvironmentInBrowser();
        }, 1600);
      }
    });
  }

  openEnvironmentInBrowser(): void {
    const origin = this.document.location.origin;
    const url = origin + this.router.serializeUrl(
      this.router.createUrlTree(['/instance/', this.environment.instance_id])
    );
    if (!this.isWaitingInterval) {
      window.open(url, '_blank');
    }
    // this.router.navigateByUrl('/instance/' + this.environment.instance_id);
  }

  stopEnvironment(): void {
    // confirm deletion for non-failed instances
    if (this.instance.state !== InstanceStates.Failed
      && !confirm('Have you saved your edited files? Once environment shutdown, it will be deleted.')) {
      return;
    }
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    instance.state = InstanceStates.Deleting;
    // ---- Delete data for instance-notification que.
    localStorage.removeItem(instance.name);

    this.instanceService.deleteInstance(instance.id).subscribe(_ => {
      // console.log('instance deleting process finished');
    });
  }
}
