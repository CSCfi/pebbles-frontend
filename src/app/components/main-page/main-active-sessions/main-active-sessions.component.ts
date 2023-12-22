import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Data } from '@angular/router';
import { ApplicationSessionService } from '../../../services/application-session.service';
import { ApplicationSession, ApplicationSessionLog, SessionStates } from '../../../models/application-session';
import { ApplicationService } from '../../../services/application.service';
import { Utilities } from '../../../utilities';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export interface SessionTableRow {
  isSelected: boolean;
  index: number;
  workspaceName: string;
  applicationName: string;
  sessionName: string;
  sessionUrl: string;
  username: string;
  state: string;
  lifetimeLeft: string;
  sessionId: string;
}

@Component({
  selector: 'app-main-active-sessions',
  templateUrl: './main-active-sessions.component.html',
  styleUrls: ['./main-active-sessions.component.scss']
})
export class MainActiveSessionsComponent implements OnInit, OnDestroy {

  context: Data;
  sessions: ApplicationSession[];
  lastUpdateTs = 0;
  interval = 0;
  queryText = '';

  displayedColumns: string[] = [
    'index', 'isSelected', 'sessionName', 'workspaceName', 'applicationName', 'username', 'state', 'lifetimeLeft',
    'sessionDetails', 'sessionLink'
  ];
  dataSource: MatTableDataSource<SessionTableRow>;
  selection = new SelectionModel<SessionTableRow>(true, []);
  tableRowData: SessionTableRow[] = [];
  sortCondition: Sort = {
    direction: 'asc',
    active: 'index'
  };
  @ViewChild(MatSort) sort: MatSort;
  activeSessionNumber = 0;
  selectedDetailSessionId: string | null = null;
  selectedSessionLogs: ApplicationSessionLog[] = [];
  selectedSessionPreviousState: SessionStates;
  logRefreshPending: boolean = false;

  protected readonly SessionStates = SessionStates;

  get selectedDetailSession(): ApplicationSession | null {
    return this.applicationSessionService.getSession(this.selectedDetailSessionId);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private applicationSessionService: ApplicationSessionService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.applicationService.fetchApplications().subscribe(() => {
      this.applicationSessionService.fetchSessions().subscribe(() => {
        this.updateView();
        //this.showSessionDetails(this.applicationSessionService.getSessions()[0].id);
      })
    });
    this.interval = window.setInterval(() => this.updateView(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.interval = 0;
  }

  refreshSessionContent(): void {
    this.applicationSessionService.fetchSessions().subscribe(_ =>
      this.updateRowData(true)
    );
  }

  updateView(force = false): void {
    if (this.selectedDetailSessionId) {
      this.updateDetailView();
    }
    else {
      this.updateRowData(force);
    }
  }

  updateDetailView() {
    // refresh logs in case
    // a) the session does not have a 'ready' event yet
    // b) the user has requested new logs and the logs have been fetched by the worker already
    if (!this.selectedSessionLogs.find(x => x.message === 'ready')) {
      this.selectedSessionPreviousState = this.selectedDetailSession.state;
      this.refreshApplicationSessionLogs(this.selectedDetailSessionId);
    }
    else if (this.logRefreshPending && !this.selectedDetailSession?.log_fetch_pending) {
      this.refreshApplicationSessionLogs(this.selectedDetailSessionId);
      this.logRefreshPending = false;
    }
  }


  updateRowData(force = false): void {
    // first check if we already have the latest data
    const sessionServiceUpdateTs = this.applicationSessionService.getLastUpdateTs();
    if (!force && this.lastUpdateTs === sessionServiceUpdateTs) {
      return;
    }
    this.lastUpdateTs = sessionServiceUpdateTs;

    // record if there are sessions without the corresponding application
    let applicationsMissing = false;
    // update existing row data entries and insert new ones
    this.applicationSessionService.getAllSessions().map((session, index) => {
      // if the application for the session is not present, refresh applications
      if (!this.applicationService.get(session.application_id)) {
        applicationsMissing = true;
      }
      const existingEntry = this.tableRowData.find(r => r.sessionId === session.id);
      if (existingEntry) {
        existingEntry.lifetimeLeft = Utilities.lifetimeToString(session.lifetime_left);
        existingEntry.state = session.state;
        existingEntry.index = -1;
        existingEntry.workspaceName = this.applicationService.get(session.application_id)?.workspace_name;
        existingEntry.applicationName = this.applicationService.get(session.application_id)?.name;
        existingEntry.sessionUrl = session.url;
        existingEntry.username = session.username;
      }
      else {
        this.tableRowData.push({
          isSelected: false,
          index: -1,
          workspaceName: this.applicationService.get(session.application_id)?.workspace_name,
          applicationName: this.applicationService.get(session.application_id)?.name,
          sessionName: session.name,
          sessionUrl: session.url,
          username: session.username,
          state: session.state,
          lifetimeLeft: this.lifetimeToString(session.lifetime_left),
          sessionId: session.id,
        });
      }
    });

    // refresh in case we found sessions that refer to applications that the service does not have
    if (applicationsMissing) {
      this.applicationService.fetchApplications().subscribe(_ => {
        window.setTimeout(() => this.updateRowData(true), 1);
      });
    }

    this.activeSessionNumber = this.applicationSessionService.getAllSessions().length;
    // leave only fresh data
    this.tableRowData = this.tableRowData.filter(r => r.index < 0);
    // update indexes
    for (let i = 0; i < this.tableRowData.length; i++) {
      this.tableRowData[i].index = i + 1;
    }
    // create a new datasource to trigger table rendering
    const sortedData = this.tableRowData.slice();
    this.sortData(sortedData, this.sortCondition);

    this.dataSource = new MatTableDataSource<SessionTableRow>(sortedData);
    this.dataSource.filter = Utilities.cleanText(this.queryText);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SessionTableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  lifetimeToString(lifetime: number) {
    return Utilities.lifetimeToString(lifetime);
  }

  applyFilter(value: string): void {
    this.queryText = value;
    this.selection.clear();
    this.updateRowData(true);
  }

  openStopSessionDialog(selectedSessions: SessionTableRow[]): void {
    let sessionNamesList = '';
    selectedSessions.forEach(sess => {
      sessionNamesList += `<li>${sess.sessionName} <span class="ml-5">(${sess.username})</span></li>`;
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm session deletion',
        dialogContent: `<p>The following sessions will be deleted.</p><ul class="list-style">${sessionNamesList}</ul>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (const row of selectedSessions) {
          const sessionId = row.sessionId;
          this.applicationSessionService.deleteSession(sessionId).subscribe();
          row.state = 'deleting';
        }
        this.selection.clear();
      }
    });
  }

  openEnterSessionDialog(sessionRow: SessionTableRow): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm enter session',
        dialogContent:
          '<p>Entering a session can cause disconnect or undefined behaviour to the original user of the session.' +
          '<p>Are you sure you want to do this?',
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.open(sessionRow.sessionUrl, '_blank');
      }
    });
  }

  changeSortCondition(sort: Sort): void {
    this.sortCondition = {
      direction: sort.direction,
      active: sort.active
    };
    this.updateRowData(true);
  }

  sortData(data: SessionTableRow[], sort: Sort): void {
    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'index':
          return Utilities.compare(a.index, b.index, isAsc);
        case 'workspaceName':
          return Utilities.compare(a.workspaceName, b.workspaceName, isAsc);
        case 'applicationName':
          return Utilities.compare(a.applicationName, b.applicationName, isAsc);
        case 'username':
          return Utilities.compare(a.username, b.username, isAsc);
        case 'state':
          return Utilities.compare(a.state, b.state, isAsc);
        case 'lifetimeLeft':
          return Utilities.compare(a.lifetimeLeft, b.lifetimeLeft, isAsc);
        default:
          return 0;
      }
    });
  }

  showSessionDetails(sessionId: string): void {
    this.selectedDetailSessionId = sessionId;
    this.refreshApplicationSessionLogs(sessionId);
  }

  closeSessionDetails(): void {
    this.selectedDetailSessionId = null;
    this.selectedSessionLogs = [];
    this.updateRowData();
  }

  requestLogFetch(sessionId: string): void {
    this.logRefreshPending = true;
    this.applicationSessionService.requestLogFetch(sessionId).subscribe();
  }

  refreshApplicationSessionLogs(sessionId: string): void {
    this.applicationSessionService.fetchApplicationSessionLogs(sessionId).subscribe(logs => {
      this.selectedSessionLogs = logs;
      setTimeout(() => {
        const terminal = document.getElementById("terminal");
        if (terminal) {
          terminal.scrollTop = terminal.scrollHeight;
        }
      }, 100);
    });
  }

  getSelectedSessionEvents(): ApplicationSessionLog[] {
    return this.selectedSessionLogs.filter(x => x.log_type == 'provisioning');
  }

  getSelectedSessionOutputLines(): string[] {
    const runningLog = this.selectedSessionLogs.find(x => x.log_type == 'running');
    return runningLog ? runningLog.message.split('\n') : [];
  }
}
