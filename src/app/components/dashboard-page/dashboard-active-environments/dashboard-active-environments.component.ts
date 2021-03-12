import {Component, OnDestroy, OnInit} from '@angular/core';
import {InstanceService} from '../../../services/instance.service';
import {Instance} from '../../../models/instance';
import {EnvironmentService} from '../../../services/environment.service';
import {Utilities} from '../../../utilities';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface InstanceTableRow {
  isSelected: boolean;
  index: number;
  workspaceName: string;
  environmentName: string;
  username: string;
  state: string;
  lifetimeLeft: string;
  instanceId: string;
}

@Component({
  selector: 'app-dashboard-active-environments',
  templateUrl: './dashboard-active-environments.component.html',
  styleUrls: ['./dashboard-active-environments.component.scss']
})
export class DashboardActiveEnvironmentsComponent implements OnInit, OnDestroy {

  public content = {
    path: 'active-environments',
    title: 'Active environments',
    identifier: 'active-environments'
  };

  displayedColumns: string[] = [
    'isSelected', 'workspaceName', 'environmentName', 'username', 'state', 'lifetimeLeft'];
  selection = new SelectionModel<InstanceTableRow>(true, []);
  tableRowData: InstanceTableRow[] = [];
  instances: Instance[];

  lastUpdateTs = 0;
  dataSource: MatTableDataSource<InstanceTableRow>;
  interval = 0;

  constructor(
    public instanceService: InstanceService,
    public environmentService: EnvironmentService,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InstanceTableRow>(this.tableRowData);
    this.environmentService.fetchEnvironments().subscribe(() =>
      this.instanceService.fetchInstances().subscribe(() =>
        this.updateRowData()
      )
    );
    this.interval = window.setInterval(() => this.updateRowData(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  updateRowData(): void {
    // first check if we already have the latest data
    const instanceServiceUpdateTs = this.instanceService.getLastUpdateTs();
    if (this.lastUpdateTs === instanceServiceUpdateTs) {
      return;
    }
    this.lastUpdateTs = instanceServiceUpdateTs;

    // update existing row data entries and insert new ones
    this.instanceService.getAllInstances().map(instance => {
      const existingEntry = this.tableRowData.find(r => r.instanceId === instance.id);
      if (existingEntry) {
        existingEntry.lifetimeLeft = Utilities.lifetimeToString(instance.lifetime_left);
        existingEntry.state = instance.state;
        existingEntry.index = -1;
        existingEntry.workspaceName = this.environmentService.get(instance.environment_id)?.workspace_name;
        existingEntry.environmentName = this.environmentService.get(instance.environment_id)?.name;
        existingEntry.username = instance.username;
      } else {
        this.tableRowData.push({
          isSelected: false,
          index: -1,
          workspaceName: this.environmentService.get(instance.environment_id)?.workspace_name,
          environmentName: this.environmentService.get(instance.environment_id)?.name,
          username: instance.username,
          state: instance.state,
          lifetimeLeft: this.lifetimeToString(instance.lifetime_left),
          instanceId: instance.id,
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
    this.dataSource = new MatTableDataSource<InstanceTableRow>(this.tableRowData);
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
  checkboxLabel(row?: InstanceTableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  lifetimeToString(lifetime: number) {
    return Utilities.lifetimeToString(lifetime);
  }

  deleteSelectedInstances() {
    for (const row of this.selection.selected) {
      const instanceId = row.instanceId;
      console.log('deleting instance ' + instanceId);
      this.instanceService.deleteInstance(instanceId).subscribe(_ => {
        console.log('deleted ' + instanceId);
      });
      row.state = 'deleting';
    }
    this.selection.clear();
  }
}
