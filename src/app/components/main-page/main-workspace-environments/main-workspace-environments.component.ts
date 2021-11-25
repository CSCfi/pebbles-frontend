import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { Application } from 'src/app/models/application';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationType } from '../../../models/application-template';
import { EventService } from '../../../services/event.service';
import { Utilities } from '../../../utilities';
import { MainEnvironmentItemFormComponent } from '../main-environment-item-form/main-environment-item-form.component';
import { MainEnvironmentWizardFormComponent } from '../main-environment-wizard-form/main-environment-wizard-form.component';

export interface EnvironmentRow {
  select: boolean;
  index: number;
  id: string;
  name: string;
  description: string;
  type: ApplicationType;
  state: string;
  is_enabled: boolean;
  lifetime: string;
  labels: string[];
  session_id: string;
  workspace_name: string;
  memory: number;
  work_folder_enabled: boolean;
}

@Component({
  selector: 'app-main-workspace-environments',
  templateUrl: './main-workspace-environments.component.html',
  styleUrls: ['./main-workspace-environments.component.scss']
})
export class MainWorkspaceEnvironmentsComponent implements OnInit, OnDestroy, OnChanges {

  faBook = faBook;
  faRProject = faRProject;
  faPython = faPython;
  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  public displayedColumns: string[] = ['thumbnail', 'info', 'meta', 'launch', 'menu'];
  public dataSource: MatTableDataSource<EnvironmentRow> = null;
  public selection = new SelectionModel<EnvironmentRow>(true, []);
  // ---- Paginator
  public isPaginatorVisible = false;
  public minUnitNumber = 25;
  public pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() workspaceId: string = null;

  constructor(
    private route: ActivatedRoute,
    private environmentService: ApplicationService,
    private dialog: MatDialog,
    private eventService: EventService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.eventService.applicationDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // selected workspace changed, clear old data and rebuild data source
    this.dataSource = null;
    this.rebuildDataSource();
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  rebuildDataSource(): void {
    // we need the environmentService to be ready
    if (!this.environmentService.isInitialized) {
      return;
    }
    // wait for paginator to be initialized by Angular, otherwise defer to next tick
    if (!(this.paginator)) {
      setTimeout(() => this.rebuildDataSource(), 0);
      return;
    }
    console.log('MainWorkspaceEnvironmentsComponent.rebuildDataSource()');
    const envs = this.environmentService.getApplicationsByWorkspaceId(this.workspaceId).sort(
      (a, b) => Number(b.is_enabled) - Number(a.is_enabled));
    this.dataSource = this.composeDataSource(envs);
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.dataSource, this.minUnitNumber);
    this.isPaginatorVisible = this.dataSource.data.length > this.minUnitNumber;
    this.paginator.length = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
  }

  composeDataSource(envs: Application[]): MatTableDataSource<any> {
    return new MatTableDataSource(
      envs.map((env, i) => {
        return {
          select: false,
          is_enabled: env.is_enabled,
          index: i,
          id: env.id,
          name: env.name,
          template: env.template_name,
          description: env.description,
          type: env.applicationType,
          lifetime: env.maximum_lifetime,
          labels: env.labels,
          session_id: env.session_id,
          workspace_name: env.workspace_name,
          work_folder_enabled: env.info?.work_folder_enabled,
          memory: env.info?.memory
        };
      })
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // getLifetime(number): string {
  //   const hours = Number(this.environment.maximum_lifetime) / 3600;
  //   const mins = Number(this.environment.maximum_lifetime) % 3600;
  //   return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
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

  getTargetEnvironment(id: string): Application {
    return this.environmentService.getApplicationById(id);
  }

  getLifetime(sec: number): string {
    const hours = sec / 3600;
    const mins = sec % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  toggleEnvironmentActivation(isActive: boolean, environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    environment.is_enabled = isActive;
    this.environmentService.updateApplication(environment).subscribe(_ => {
      console.log('Updated environment');
    });
  }

  copyEnvironment(environmentId: string): void {
    const environment = this.getTargetEnvironment(environmentId);
    if (!confirm(`Are you sure you want to copy this environment "${environment.name}"?`)) {
      return;
    }
    this.environmentService.copyApplication(environment).subscribe();
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
    this.environmentService.deleteApplication(environment).subscribe(_ => {
      console.log('environment deleting process finished');
    });
  }

  openEnvironmentItemFormDialog(environmentId: string | null): void {
    this.dialog.open(MainEnvironmentItemFormComponent, {
      width: '800px',
      height: '90vh',
      autoFocus: false,
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
      autoFocus: false,
      data: {
        workspaceId: this.workspaceId
      }
    }).afterClosed().subscribe(_ => {
    });
  }
}
