import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EnvironmentType } from '../../../models/environment-template';
import { Environment } from 'src/app/models/environment';
import { Instance, InstanceStates } from 'src/app/models/instance';
import { EnvironmentService } from 'src/app/services/environment.service';
import { InstanceService } from 'src/app/services/instance.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-environment-item',
  templateUrl: './main-environment-item.component.html',
  styleUrls: ['./main-environment-item.component.scss']
})
export class MainEnvironmentItemComponent implements OnInit {

  @Input() environment: Environment;
  @Input() content: any;
  @Output() getEnvironmentsEvent = new EventEmitter<string>();

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
    // TODO: when backend supports environment type in API, simply use that
    let environmentType = EnvironmentType.Generic;
    if (this.environment?.labels.indexOf('jupyter') >= 0) {
      environmentType = EnvironmentType.Jupyter;
    }
    else if (this.environment?.labels.indexOf('rstudio') >= 0) {
      environmentType = EnvironmentType.RStudio;
    }
    return environmentType;
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
    private router: Router,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private environmentService: EnvironmentService,
    private instanceService: InstanceService,
  ) { }

  ngOnInit(): void {
    // console.log(`--------- env ${ this.environment.id } --------`);
  }

  toggleEnvironmentActivation(isActive: boolean): void {
    this.environment.is_enabled = isActive;
    this.environmentService.updateEnvironment(this.environment).subscribe(_ => {
      console.log('Updated environment');
      this.getEnvironmentsEvent.emit();
    });
  }

  copyEnvironment(): void {
    if (!confirm(`Are you sure you want to copy this environment "${this.environment.name}"?`)) {
      return;
    }
    this.environmentService.copyEnvironment(this.environment).subscribe( _ => {
      console.log('Environment copying process finished');
      this.getEnvironmentsEvent.emit();
    });
  }

  toggleGpuActivation(active): void {
    // ---- TODO: place holder. write later !
  }

  deleteEnvironment(): void {
    if (!confirm(`Are you sure you want to delete this environment "${this.environment.name}"?`)) {
      return;
    }
    this.environmentService.deleteEnvironment(this.environment).subscribe( _ => {
      console.log('environment deleting process finished');
      this.getEnvironmentsEvent.emit();
    });
  }

  // ---- Instance
  // ----------------------------------------

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

  getInstance(): Instance {
    return this.instanceService.getInstance(this.environment.instance_id);
  }

  actionsVisible(): boolean {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    return instance && instance.state !== InstanceStates.Deleted;
  }
}
