import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnvironmentSessionService } from '../../../services/environment-session.service';
import { EnvironmentSession } from '../../../models/environment-session';
import { EnvironmentService } from '../../../services/environment.service';
import { Utilities } from '../../../utilities';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export interface SessionTableRow {
  isSelected: boolean;
  index: number;
  workspaceName: string;
  environmentName: string;
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
    'isSelected', 'workspaceName', 'environmentName', 'sessionName', 'username', 'state', 'lifetimeLeft'
  ];
  selection = new SelectionModel<SessionTableRow>(true, []);
  tableRowData: SessionTableRow[] = [];
  sessions: EnvironmentSession[];

  lastUpdateTs = 0;
  dataSource: MatTableDataSource<SessionTableRow>;
  interval = 0;
  queryText = '';

  constructor(
    private environmentSessionService: EnvironmentSessionService,
    private environmentService: EnvironmentService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<SessionTableRow>(this.tableRowData);
    this.environmentService.fetchEnvironments().subscribe(() =>
      this.environmentSessionService.fetchSessions().subscribe(() =>
        this.updateRowData()
      )
    );
    this.interval = window.setInterval(() => this.updateRowData(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.interval = 0;
  }

  updateRowData(force = false): void {
    // first check if we already have the latest data
    const sessionServiceUpdateTs = this.environmentSessionService.getLastUpdateTs();
    if (!force && this.lastUpdateTs === sessionServiceUpdateTs) {
      return;
    }
    this.lastUpdateTs = sessionServiceUpdateTs;

    // update existing row data entries and insert new ones
    this.environmentSessionService.getAllSessions().map(session => {
      const existingEntry = this.tableRowData.find(r => r.sessionId === session.id);
      if (existingEntry) {
        existingEntry.lifetimeLeft = Utilities.lifetimeToString(session.lifetime_left);
        existingEntry.state = session.state;
        existingEntry.index = -1;
        existingEntry.workspaceName = this.environmentService.get(session.environment_id)?.workspace_name;
        existingEntry.environmentName = this.environmentService.get(session.environment_id)?.name;
        existingEntry.sessionUrl = session.url;
        existingEntry.username = session.username;
      } else {
        this.tableRowData.push({
          isSelected: false,
          index: -1,
          workspaceName: this.environmentService.get(session.environment_id)?.workspace_name,
          environmentName: this.environmentService.get(session.environment_id)?.name,
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
    this.dataSource = new MatTableDataSource<SessionTableRow>(this.tableRowData);
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
    let namesList = '';
    selectedSessions.forEach(sess => {
      namesList += `<li>${sess.sessionName}</li>`;
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm session deletion',
        dialogContent: `<p>The following sessions will be deleted</p><ul>${namesList}</ul>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (const row of selectedSessions) {
          const sessionId = row.sessionId;
          console.log('deleting session ' + sessionId);
          this.environmentSessionService.deleteSession(sessionId).subscribe(_ => {
            console.log('deleted ' + sessionId);
          });
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
}
