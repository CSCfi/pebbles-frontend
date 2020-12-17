import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { InstanceStates } from 'src/app/models/instance';
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

  get state(): InstanceStates{
    return this.instanceService.getInstance(this.environment.instance_id).state;
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private environmentService: EnvironmentService,
    private instanceService: InstanceService,
  ) {
  }

  ngOnInit(): void {
    // console.log(`--------- env ${ this.environment.id } --------`);
  }

  getThumbnail(): string {
    // Dummy
    if (this.environment.thumbnail) {
      return `assets/images/environment-item-thumb-${this.environment.thumbnail}.png`;
    } else {
      return '';
    }
  }

  getCapitals(): string {
    // Dummy
    return 'DL';
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

  actionsVisible() {
    const instance = this.instanceService.getInstance(this.environment.instance_id);
    return instance && instance.state !== InstanceStates.Deleted;
  }
}
