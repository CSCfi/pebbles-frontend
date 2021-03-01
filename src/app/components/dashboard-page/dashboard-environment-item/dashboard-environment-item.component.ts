import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
  @Output() getEnvironmentsEvent = new EventEmitter<string>();

  // ---- Setting of a spinner
  spinnerMode: ProgressSpinnerMode = 'determinate';
  isWaitingInterval = false;

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
    return this.lifetimePercentage < 25 && !this.isSpinnerOn;
  }

  get lifetime(): string {
    const hours = Number(this.environment.maximum_lifetime) / 3600;
    const mins = Number(this.environment.maximum_lifetime) % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  get lifetimePercentage(): number {
    if (this.instance) {
      const res = Number(this.instance.lifetime_left) / Number(this.environment.maximum_lifetime) * 100;
      return Math.floor(res);
    }
    return 0;
  }

  get lifetimeLeft(): string {
    if (this.instance.state === 'running' && this.instance.lifetime_left) {
      const hours: number = Math.floor(this.instance.lifetime_left / 3600);
      const mins: number = Math.floor((this.instance.lifetime_left % 3600) / 60);
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

  openEditEnvironmentDialog(): void {
    this.dialog.open(DashboardEnvironmentItemFormComponent, {
      width: '800px',
      height: 'auto',
      data: {
        environment: this.environment
      }
    });
  }

  toggleEnvironmentActivation(isActive: boolean): void {
    // ---- TODO: place holder. write later !
  }

  copyEnvironment(): void {
    // ---- TODO: place holder. write later !
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
    if (!confirm('Have you saved your edited files? Once environment shutdown, it will be deleted.')) {
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

  restartEnvironment(): void {
    // ---- write later
  }

  getInstance(): Instance {
    return this.instanceService.getInstance(this.environment.instance_id);
  }

  actionsVisible(): boolean {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    return instance && instance.state !== InstanceStates.Deleted;
  }
}
