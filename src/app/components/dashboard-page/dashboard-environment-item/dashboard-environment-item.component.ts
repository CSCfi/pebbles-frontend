import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { Instance, InstanceStates } from 'src/app/models/instance';
import { EnvironmentService } from 'src/app/services/environment.service';
import { InstanceService } from 'src/app/services/instance.service';
import { DashboardEnvironmentItemFormComponent } from '../dashboard-environment-item-form/dashboard-environment-item-form.component';

@Component({
  selector: 'app-dashboard-environment-item',
  templateUrl: './dashboard-environment-item.component.html',
  styleUrls: ['./dashboard-environment-item.component.scss']
})
export class DashboardEnvironmentItemComponent implements OnInit {

  @Input() environment: Environment;
  @Input() content: any;

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';

  get isSpinnerOn(): boolean {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    if (instance) {
      switch (this.state) {
        case 'running':
        case 'deleted':
          return false;
        default:
          return true;
      }
    }
    return false;
  }

  get state(): InstanceStates | null {
    const instance = this.getInstance();
    if (instance) {
      return instance.state;
    }
    return null;
  }

  get labels(): string {
    return this.environment.labels.join(', ');
  }

  get isTimeWarningOn(): boolean {
    return this.lifetimePercentage < 25;
  }

  get lifetime(): string {
    const hours = Number(this.environment.maximum_lifetime) / 3600;
    const mins = Number(this.environment.maximum_lifetime) % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  get lifetimePercentage(): number {
    const instance = this.getInstance();
    if (instance) {
      const res = Number(instance.lifetime_left) / Number(this.environment.maximum_lifetime) * 100;
      return Math.floor(res);
    }
    return 0;
  }

  get lifetimeLeft(): string {
    const instance = this.getInstance();
    if (instance.state === 'running' && instance.lifetime_left) {
      const hours: number = Math.floor(instance.lifetime_left / 3600);
      const mins: number = Math.floor((instance.lifetime_left % 3600) / 60);
      return `${(hours < 10) ? '0' + hours : hours}:${(mins < 10) ? '0' + mins : mins}`;
    }
    return '';
  }

  get thumbnail(): string {
    return '<img src="assets/images/environment-item-thumb-jupyter_white.svg" width="90">';
    let element = '<i class="las la-book"></i>';
    if (this.environment.thumbnail) {
      switch (this.environment.thumbnail) {
        case 'jupyter':
          element = '<img src="assets/images/environment-item-thumb-jupyter_white.svg" width="90">';
          break;
        case 'r-studio':
          element = '<span class="r-studio">R</span>';
          break;
        default:
          element = '<i class="las la-book"></i>';
          break;
      }
    }
    return element;
  }

  get description(): string {
    if (this.environment && this.environment.description) {
      return this.environment.description;
    } else {
      return 'The environment has no description.';
    }
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



  openDialog(): void {
    this.dialog.open(DashboardEnvironmentItemFormComponent, {
      width: '800px',
      height: 'auto',
      data: {
        environment: this.environment
      }
    });
  }

  // ---- Instance
  // ----------------------------------------

  startEnvironment(): void {
    console.log(this.environment.id);
    this.environmentService.startEnvironment(this.environment.id).subscribe(_ => {
      this.openEnvironmentInBrowser();
    });
  }

  openEnvironmentInBrowser(): void {
    const origin = this.document.location.origin;
    const url = origin + this.router.serializeUrl(
      this.router.createUrlTree(['/instance/', this.environment.instance_id])
    );
    window.open(url, '_blank');
    // this.router.navigateByUrl('/instance/' + this.environment.instance_id);
  }

  stopEnvironment(): void {
    if (!confirm('Have you saved your edited files? Once environment shutdown, it will be deleted.')) {
      return;
    }
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    instance.state = InstanceStates.Deleting;
    // ---- Delete data for instance-notification que.
    localStorage.removeItem(instance.name);

    this.instanceService.deleteInstance(instance.id).subscribe(_ => {
      console.log('instance deleting process finished');
    });
  }

  restartEnvironment(): void {
    // ---- write later
  }

  getInstance(): Instance {
    return this.instanceService.getInstance(this.environment.instance_id);
  }

  actionsVisible() {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    return instance && instance.state !== InstanceStates.Deleted;
  }
}
