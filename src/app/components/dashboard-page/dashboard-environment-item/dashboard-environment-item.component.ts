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
  spinnerValue = 50;

  get state(): InstanceStates{
    return this.instanceService.getInstance(this.environment.instance_id).state;
  }

  get lifetimePercentage(): any {
    const instance = this.getInstance();
    return instance ? (100 - (30 / 120 ) * 100) : 99;
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

  getThumbnail(): string {
    let element: string;

    switch (this.environment.thumbnail) {
      case 'jupyter':
        element = '<img src="assets/images/environment-item-thumb-jupyter_gray.svg" width="90">';
        break;
      case 'ipython':
        element = '<i class="las la-book"></i>';
        break;
      case 'r-studio':
        element = '<span class="r-studio">R</span>';
        break;
      case 'deep-learning':
        element = '<i class="las la-brain"></i>';
        break;
      case 'machine-learning':
        element = '<i class="las la-cogs"></i>';
        break;
      case 'data-science':
        element = '<i class="las la-chart-bar"></i>';
        break;
      case 'icon':
        element = `<i class="la las lab lar ${this.environment.thumbnail}"></i>`;
        break;
      case 'abbreviation':
        element = `<span>${this.environment.thumbnail}</span>`;
        break;
      case 'text':
        element = `<span>${this.environment.thumbnail}</span>`;
        break;
      default:
        element = 'No image';
        break;
    }

    return element;
  }

  openDialog(): void {
    this.dialog.open( DashboardEnvironmentItemFormComponent, {
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
    this.environmentService.startEnvironment(this.environment.id).subscribe( _ => {
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
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    instance.state = InstanceStates.Deleting;
    // ---- Delete data for instance-notification que.
    localStorage.removeItem(instance.name);

    this.instanceService.deleteInstance(instance.id).subscribe(_ => {
      console.log('instance deleting process finished');
    });
  }



  getInstance(): Instance {
    return this.instanceService.getInstance(this.environment.instance_id);
  }

  actionsVisible() {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    return instance && instance.state !== InstanceStates.Deleted;
  }
}
