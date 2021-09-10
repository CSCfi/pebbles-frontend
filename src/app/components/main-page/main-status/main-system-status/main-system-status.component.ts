import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../../models/alert';
import { AlertService } from '../../../../services/alert.service';
import { InstanceService } from '../../../../services/instance.service';

@Component({
  selector: 'app-main-system-status',
  templateUrl: './main-system-status.component.html',
  styleUrls: ['./main-system-status.component.scss']
})
export class MainSystemStatusComponent implements OnInit, OnDestroy {
  public content = {
    path: 'system-status',
    title: 'System status',
    identifier: 'system-status'
  };

  interval: number;

  constructor(
    private alertService: AlertService,
    private instanceService: InstanceService
  ) {
  }

  ngOnInit(): void {
    this.refresh();
    this.interval = window.setInterval(_ => this.refresh(), 30 * 1000);
  }

  getAlerts(): Alert[] {
    return this.alertService.getAlerts();
  }

  getSystemStatus(): string {
    return this.alertService.getSystemStatus() ? this.alertService.getSystemStatus() : 'unknown';
  }

  getInstanceSummary(): any {
    const instances = this.instanceService.getAllInstances();
    const nRunning = instances.filter(i => i.state === 'running').length;
    const nQueueing = instances.filter(i => i.state === 'queueing').length;
    const nStarting = instances.filter(i => i.state === 'starting').length;
    const nDeleting = instances.filter(i => i.state === 'deleting').length;
    return {nRunning, nQueueing, nStarting, nDeleting};
  }

  refresh() {
    this.alertService.fetchSystemStatus().subscribe();
    this.alertService.fetchAlerts().subscribe();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }
}
