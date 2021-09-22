import {Component, OnDestroy, OnInit} from '@angular/core';
import {EnvironmentSessionService} from '../../../services/environment-session.service';
import {EnvironmentSession} from '../../../models/environment-session';
import {EnvironmentService} from '../../../services/environment.service';
import {Utilities} from '../../../utilities';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface SessionTableRow {
  isSelected: boolean;
  index: number;
  workspaceName: string;
  environmentName: string;
  username: string;
  state: string;
  lifetimeLeft: string;
  sessionId: string;
}

@Component({
  selector: 'app-main-active-environments',
  templateUrl: './main-active-environments.component.html',
  styleUrls: ['./main-active-environments.component.scss']
})
export class MainActiveEnvironmentsComponent implements OnInit, OnDestroy {

  public content = {
    path: 'active-environments',
    title: 'Active environments',
    identifier: 'active-environments'
  };

  displayedColumns: string[] = [
    'isSelected', 'workspaceName', 'environmentName', 'username', 'state', 'lifetimeLeft'
  ];
  selection = new SelectionModel<SessionTableRow>(true, []);
  tableRowData: SessionTableRow[] = [];
  sessions: EnvironmentSession[];

  lastUpdateTs = 0;
  dataSource: MatTableDataSource<SessionTableRow>;
  interval = 0;
  queryText = '';

  constructor(
    public environmentSessionService: EnvironmentSessionService,
    public environmentService: EnvironmentService,
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
        existingEntry.username = session.username;
      } else {
        this.tableRowData.push({
          isSelected: false,
          index: -1,
          workspaceName: this.environmentService.get(session.environment_id)?.workspace_name,
          environmentName: this.environmentService.get(session.environment_id)?.name,
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
    const numRows = this.tableRowData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableRowData.forEach(row => this.selection.select(row));
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

  deleteSelectedSessions() {
    for (const row of this.selection.selected) {
      const sessionId = row.sessionId;
      console.log('deleting session ' + sessionId);
      this.environmentSessionService.deleteSession(sessionId).subscribe(_ => {
        console.log('deleted ' + sessionId);
      });
      row.state = 'deleting';
    }
    this.selection.clear();
  }

  applyFilter(value: string ): void {
    this.queryText = value;
    this.updateRowData(true);
  }
}
