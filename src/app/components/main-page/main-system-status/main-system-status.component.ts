import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Alert } from '../../../models/alert';
import { AlertService } from '../../../services/alert.service';
import { ApplicationSessionService } from '../../../services/application-session.service';

@Component({
  selector: 'app-main-system-status',
  templateUrl: './main-system-status.component.html',
  styleUrls: ['./main-system-status.component.scss']
})
export class MainSystemStatusComponent implements OnInit, OnDestroy {

  public context: Data;
  private interval: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private applicationSessionService: ApplicationSessionService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
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
    const sessions = this.applicationSessionService.getAllSessions();
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
