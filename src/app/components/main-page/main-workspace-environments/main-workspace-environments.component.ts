import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { MainEnvironmentWizardFormComponent } from '../main-environment-wizard-form/main-environment-wizard-form.component';
import { MainEnvironmentItemFormComponent } from '../main-environment-item-form/main-environment-item-form.component';
import { EnvironmentType } from '../../../models/environment-template';
import { MatPaginator } from '@angular/material/paginator';

export interface EnvironmentTable {
  select: boolean;
  index: number;
  id: string;
  name: string;
  description: string;
  type: EnvironmentType;
  state: string;
  lifetime: string;
  labels: string[];
  instance_id: string;
}

@Component({
  selector: 'app-main-workspace-environments',
  templateUrl: './main-workspace-environments.component.html',
  styleUrls: ['./main-workspace-environments.component.scss']
})
export class MainWorkspaceEnvironmentsComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['thumbnail', 'name', 'state', 'launch', 'edit', 'menu'];
  dataSource: MatTableDataSource<EnvironmentTable>;
  selection = new SelectionModel<EnvironmentTable>(true, []);
  environmentList = [];
  environments: Environment[] = [];
  // ---- Paginator
  isPaginatorVisible = true;
  minUnitNumber = 5;

  @Input() workspaceId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() fetchEnvironmentEvent = new EventEmitter();

  get pageSizeOptions(): number[]{
    if (this.dataSource) {
      const unitNumbers = [];
      for ( let i = 1; i < this.dataSource.data.length / this.minUnitNumber; i++) {
        unitNumbers.push(this.minUnitNumber * i);
      }
      unitNumbers.push(this.dataSource.data.length);
      return unitNumbers;
    }
    return [this.minUnitNumber];
  }

  constructor(
    public environmentService: EnvironmentService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.environmentService.fetchEnvironments().subscribe(_ => {
      const environments = this.environmentService.getEnvironmentsByWorkspaceId(changes.workspaceId.currentValue);
      this.environments = environments.sort((a, b) => Number(b.is_enabled) - Number(a.is_enabled));
      this.environmentList = this.composeDataSource();
      this.dataSource = new MatTableDataSource(this.environmentList);
      this.dataSource.paginator = this.paginator;
      this.isPaginatorVisible = this.environmentList.length > 5 ? true : false;
    });
  }

  composeDataSource(): any[] {
    const returns = this.environments.map((env, i) => {
      return {
        select: false,
        is_enabled: env.is_enabled,
        index: i,
        id: env.id,
        name: env.name,
        description: env.description,
        type: env.environment_type,
        lifetime: env.maximum_lifetime,
        labels: env.labels,
        instance_id: env.instance_id
      };
    });
    return returns;
  }

  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected(): boolean {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle(): void {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: EnvironmentTable): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  // }

  getTargetEnvironment(id: string): Environment {
    return this.environments.find(env => env.id === id);
  }

  getLifetime(sec: number): string {
    const hours = sec / 3600;
    const mins = sec % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  toggleEnvironmentActivation(isActive: boolean, environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    environment.is_enabled = isActive;
    this.environmentService.updateEnvironment(environment).subscribe(_ => {
      console.log('Updated environment');
      this.fetchEnvironmentEvent.emit();
    });
  }

  copyEnvironment(environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    if (!confirm(`Are you sure you want to copy this environment "${environment.name}"?`)) {
      return;
    }
    this.environmentService.copyEnvironment(environment).subscribe(_ => {
      console.log('Environment copying process finished');
      this.fetchEnvironmentEvent.emit();
    });
  }

  toggleGpuActivation(active): void {
    // ---- TODO: place holder. write later !
  }

  deleteEnvironment(environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    if (!confirm(`Are you sure you want to delete this environment "${environment.name}"?`)) {
      return;
    }
    this.environmentService.deleteEnvironment(environment).subscribe(_ => {
      console.log('environment deleting process finished');
      this.fetchEnvironmentEvent.emit();
    });
  }

  openEnvironmentItemFormDialog(environmentId: string | null): void {
    this.dialog.open(MainEnvironmentItemFormComponent, {
      width: '800px',
      height: '90vh',
      data: {
        workspaceId: this.workspaceId,
        environment: environmentId ? this.getTargetEnvironment(environmentId) : null
      }
    }).afterClosed().subscribe(_ => {
      this.fetchEnvironmentEvent.emit();
    });
  }

  openEnvironmentWizardDialog(): void {
    const dialogRef = this.dialog.open(MainEnvironmentWizardFormComponent, {
      width: '1000px',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        workspaceId: this.workspaceId
      }
    }).afterClosed().subscribe(_ => {
      this.fetchEnvironmentEvent.emit();
    });
  }
}
