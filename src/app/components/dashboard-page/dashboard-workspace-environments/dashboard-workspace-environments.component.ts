import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';

export interface EnvironmentTable {
  isSelected: boolean;
  index: number;
  environmentName: string;
  description: string;
  username: string;
  state: string;
  lifetimeLeft: string;
  instanceId: string;
}

@Component({
  selector: 'app-dashboard-workspace-environments',
  templateUrl: './dashboard-workspace-environments.component.html',
  styleUrls: ['./dashboard-workspace-environments.component.scss']
})
export class DashboardWorkspaceEnvironmentsComponent implements OnInit {

  @Input() workspace: Workspace;
  environments: Environment[];
  tableList = [];
  isDraft = false;

  displayedColumns: string[] = [ 'isSelected', 'thumb', 'name', 'description', 'lifetime', 'labels', 'action'];
  selection = new SelectionModel<EnvironmentTable>(true, []);
  tableRowData: EnvironmentTable[] = [];
  dataSource: MatTableDataSource<EnvironmentTable>;

  constructor(
    private workspaceService: WorkspaceService,
    public environmentService: EnvironmentService,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<EnvironmentTable>(this.tableRowData);
    this.environmentService.fetchEnvironments().subscribe( _ => {
      this.fetchTableData();
    });
  }

  fetchTableData(): void {
    this.environments = this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
    this.tableList = this.environments.map((env, i) => {
    return {
        select: false,
        index: i,
        name: env.name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. [MORE]',
        lifetime: env.maximum_lifetime,
        labels: env.labels
      };
    });
    this.dataSource = new MatTableDataSource(this.tableList);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EnvironmentTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  toggleEnvironmentActivation(isActive: boolean): void {
    // this.environment.is_enabled = isActive;
    // this.environmentService.updateEnvironment(this.environment).subscribe(_ => {
    //   console.log('Updated environment');
    //   this.getEnvironmentsEvent.emit();
    // });
  }

  copyEnvironment(): void {
    // if (!confirm(`Are you sure you want to copy this environment "${this.environment.name}"?`)) {
    //   return;
    // }
    // this.environmentService.copyEnvironment(this.environment).subscribe( _ => {
    //   console.log('Environment copying process finished');
    //   this.getEnvironmentsEvent.emit();
    // });
  }

  toggleGpuActivation(active): void {
    // ---- TODO: place holder. write later !
  }

  deleteEnvironment(): void {
    // if (!confirm(`Are you sure you want to delete this environment "${this.environment.name}"?`)) {
    //   return;
    // }
    // this.environmentService.deleteEnvironment(this.environment).subscribe( _ => {
    //   console.log('environment deleting process finished');
    //   this.getEnvironmentsEvent.emit();
    // });
  }

  openEditEnvironmentDialog() {

  }
}
