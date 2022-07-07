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
  isShowArchived: boolean;
  alerts: Alert[];
  systemStatus: String;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private applicationSessionService: ApplicationSessionService
  ) {
    this.alerts = null;
    this.systemStatus = 'Unknown';
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.refresh();
    this.interval = window.setInterval(_ => this.refresh(), 30 * 1000);
  }

  getSessionSummary(): any {
    const sessions = this.applicationSessionService.getAllSessions();
    const nRunning = sessions.filter(i => i.state === 'running').length;
    const nQueueing = sessions.filter(i => i.state === 'queueing').length;
    const nStarting = sessions.filter(i => i.state === 'starting').length;
    const nDeleting = sessions.filter(i => i.state === 'deleting').length;
    const nFailed = sessions.filter(i => i.state === 'failed').length;
    return {nRunning, nQueueing, nStarting, nDeleting, nFailed};
  }

  refresh() {
    this.alertService.fetchSystemStatus().subscribe(status => {this.systemStatus = status});
    const tsWeekAgo = Math.floor(Date.now()/1000 - 86400 * 7);
    this.alertService.fetchAlerts(this.isShowArchived, tsWeekAgo).subscribe(alerts => {this.alerts = alerts});
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }

  showArchivedCheckboxChange():void {
    this.refresh();
  }

  formatTsToUTC(ts: number) {
    return new Date(ts * 1000).toISOString().replace('T', ' ').replace('.000Z',' UTC');
  }
}
