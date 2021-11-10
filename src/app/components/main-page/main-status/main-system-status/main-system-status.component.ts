import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../../models/alert';
import { AlertService } from '../../../../services/alert.service';
import { ApplicationSessionService } from '../../../../services/application-session.service';

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
    private environmentSessionService: ApplicationSessionService
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

  getSessionSummary(): any {
    const sessions = this.environmentSessionService.getAllSessions();
    const nRunning = sessions.filter(i => i.state === 'running').length;
    const nQueueing = sessions.filter(i => i.state === 'queueing').length;
    const nStarting = sessions.filter(i => i.state === 'starting').length;
    const nDeleting = sessions.filter(i => i.state === 'deleting').length;
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
