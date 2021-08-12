import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Environment } from 'src/app/models/environment';
import { EnvironmentType } from '../../../models/environment-template';
import { EnvironmentService } from 'src/app/services/environment.service';
import { MainEnvironmentWizardFormComponent } from '../main-environment-wizard-form/main-environment-wizard-form.component';
import { MainEnvironmentItemFormComponent } from '../main-environment-item-form/main-environment-item-form.component';
import { Utilities } from '../../../utilities';
import { EventService } from '../../../services/event.service';
import { Subscription } from 'rxjs';

export interface EnvironmentRow {
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
export class MainWorkspaceEnvironmentsComponent implements OnInit, OnDestroy {
  // store subscriptions here for unsubscribing destroy time
  private subscriptions: Subscription[] = [];

  public displayedColumns: string[] = ['thumbnail', 'name', 'state', 'launch', 'edit', 'menu'];
  public dataSource: MatTableDataSource<EnvironmentRow>;
  public selection = new SelectionModel<EnvironmentRow>(true, []);
  public workspaceId: string;
  // ---- Paginator
  public isPaginatorVisible = false;
  public minUnitNumber = 25;
  public pageSizeOptions = [this.minUnitNumber];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
    private dialog: MatDialog,
    private eventService: EventService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.eventService.environmentUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
    this.route.paramMap.subscribe(params => {
      console.log(this, 'route callback');
      this.workspaceId = params.get('workspaceId');
      this.rebuildDataSource();
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  rebuildDataSource(): void {
    if (!this.paginator) {
      // wait for paginator to be initialized before actually setting data
      setTimeout(_ => this.rebuildDataSource(), 0);
      return;
    }
    console.log('MainWorkspaceEnvironmentsComponent.rebuildDataSource()');
    const envs = this.environmentService.getEnvironmentsByWorkspaceId(this.workspaceId).sort(
      (a, b) => Number(b.is_enabled) - Number(a.is_enabled));
    this.dataSource = this.composeDataSource(envs);
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.dataSource, this.minUnitNumber);
    this.isPaginatorVisible = this.dataSource.data.length > this.minUnitNumber;
    this.paginator.length = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
  }

  composeDataSource(envs: Environment[]): MatTableDataSource<any> {
    return new MatTableDataSource(
      envs.map((env, i) => {
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
      })
    );
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
    return this.environmentService.getEnvironmentById(id);
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
    });
  }

  copyEnvironment(environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    if (!confirm(`Are you sure you want to copy this environment "${environment.name}"?`)) {
      return;
    }
    this.environmentService.copyEnvironment(environment).subscribe();
  }

  toggleGpuActivation(active: boolean): void {
    console.log(active);
    // ---- TODO: place holder. write later !
  }

  deleteEnvironment(environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    if (!confirm(`Are you sure you want to delete this environment "${environment.name}"?`)) {
      return;
    }
    this.environmentService.deleteEnvironment(environment).subscribe(_ => {
      console.log('environment deleting process finished');
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
    });
  }

  openEnvironmentWizardDialog(): void {
    this.dialog.open(MainEnvironmentWizardFormComponent, {
      width: '1000px',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        workspaceId: this.workspaceId
      }
    }).afterClosed().subscribe(_ => {
    });
  }
}
