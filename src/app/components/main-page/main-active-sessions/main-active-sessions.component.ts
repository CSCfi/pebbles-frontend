import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ApplicationSessionService } from '../../../services/application-session.service';
import { ApplicationSession } from '../../../models/application-session';
import { ApplicationService } from '../../../services/application.service';
import { Utilities } from '../../../utilities';
import { MatTableDataSource } from '@angular/material/table';
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

  public content = {
    path: 'active-sessions',
    title: 'Active sessions',
    identifier: 'active-sessions'
  };

  displayedColumns: string[] = [
    'isSelected', 'sessionName', 'workspaceName', 'applicationName', 'username', 'state', 'lifetimeLeft', 'sessionLink'
  ];

  selection = new SelectionModel<SessionTableRow>(true, []);
  tableRowData: SessionTableRow[] = [];
  sessions: ApplicationSession[];
  @ViewChild(MatSort) sort: MatSort;

  lastUpdateTs = 0;
  dataSource: MatTableDataSource<SessionTableRow>;
  interval = 0;
  queryText = '';
  sortCondition: Sort = {
    direction: 'asc',
    active: 'workspaceName'
  };

  constructor(
    private applicationSessionService: ApplicationSessionService,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.applicationService.fetchApplications().subscribe(() =>
      this.applicationSessionService.fetchSessions().subscribe(() =>
        this.updateRowData()
      )
    );
    this.interval = window.setInterval(() => this.updateRowData(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.interval = 0;
  }

  refreshSessionContent(): void {
    this.applicationSessionService.fetchSessions().subscribe(_ =>
      this.updateRowData()
    );
  }

  updateRowData(force = false): void {
    // first check if we already have the latest data
    const sessionServiceUpdateTs = this.applicationSessionService.getLastUpdateTs();
    if (!force && this.lastUpdateTs === sessionServiceUpdateTs) {
      return;
    }
    this.lastUpdateTs = sessionServiceUpdateTs;

    // update existing row data entries and insert new ones
    this.applicationSessionService.getAllSessions().map(session => {
      const existingEntry = this.tableRowData.find(r => r.sessionId === session.id);
      if (existingEntry) {
        existingEntry.lifetimeLeft = Utilities.lifetimeToString(session.lifetime_left);
        existingEntry.state = session.state;
        existingEntry.index = -1;
        existingEntry.workspaceName = this.applicationService.get(session.application_id)?.workspace_name;
        existingEntry.applicationName = this.applicationService.get(session.application_id)?.name;
        existingEntry.sessionUrl = session.url;
        existingEntry.username = session.username;
      } else {
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
    // leave only fresh data
    this.tableRowData = this.tableRowData.filter(r => r.index < 0);
    // update indexes
    for (let i = 0; i < this.tableRowData.length; i++) {
      this.tableRowData[i].index = i;
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
      sessionNamesList += `<li>${sess.sessionName} <span class="ml-5">(${ sess.username })</span></li>`;
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm session deletion',
        dialogContent: `<p>The following sessions will be deleted.</p><ul class="list-style">${ sessionNamesList }</ul>`,
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
}
