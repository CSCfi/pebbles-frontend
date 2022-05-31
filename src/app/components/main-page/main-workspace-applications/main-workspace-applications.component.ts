import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Application } from 'src/app/models/application';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationType } from '../../../models/application-template';
import { Message } from '../../../models/message';
import { EventService } from '../../../services/event.service';
import { PublicConfigService } from '../../../services/public-config.service';
import { Utilities } from '../../../utilities';
import { MainApplicationItemFormComponent } from '../main-application-item-form/main-application-item-form.component';
import { MainApplicationWizardFormComponent } from '../main-application-wizard-form/main-application-wizard-form.component';

export interface ApplicationRow {
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
  selector: 'app-main-workspace-applications',
  templateUrl: './main-workspace-applications.component.html',
  styleUrls: ['./main-workspace-applications.component.scss']
})
export class MainWorkspaceApplicationsComponent implements OnInit, OnDestroy, OnChanges {

  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];
  public isSessionDeleted = false;
  public message: Message;

  public displayedColumns: string[] = ['thumbnail', 'info', 'meta', 'launch', 'menu'];
  public dataSource: MatTableDataSource<ApplicationRow> = null;
  public selection = new SelectionModel<ApplicationRow>(true, []);

  // ---- Paginator
  public isPaginatorVisible = false;
  public minUnitNumber = 25;
  public pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() context: Data;
  @Input() workspaceId: string = null;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private eventService: EventService,
    public publicConfigService: PublicConfigService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.eventService.applicationDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
    this.subscriptions.push(this.eventService.messageDataUpdate$.subscribe(message => {
      this.message = message;
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
    // we need the applicationService to be ready
    if (!this.applicationService.isInitialized) {
      return;
    }
    // wait for paginator to be initialized by Angular, otherwise defer to next tick
    if (!(this.paginator)) {
      setTimeout(() => this.rebuildDataSource(), 0);
      return;
    }
    const envs = this.applicationService.getApplicationsByWorkspaceId(this.workspaceId).sort(
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
          type: env.application_type,
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
  //   const hours = Number(this.application.maximum_lifetime) / 3600;
  //   const mins = Number(this.application.maximum_lifetime) % 3600;
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
  // checkboxLabel(row?: ApplicationTable): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  // }

  getTargetApplication(id: string): Application {
    return this.applicationService.getApplicationById(id);
  }

  toggleApplicationActivation(isActive: boolean, applicationId: string): void {
    const application = this.getTargetApplication(applicationId);
    application.is_enabled = isActive;
    this.applicationService.updateApplication(application).subscribe();
  }

  copyApplication(applicationId: string): void {
    const application = this.getTargetApplication(applicationId);
    if (!confirm(`Are you sure you want to copy this application "${application.name}"?`)) {
      return;
    }
    this.applicationService.copyApplication(application).subscribe();
  }

  toggleGpuActivation(active: boolean): void {
    // ---- TODO: place holder. write later !
  }

  deleteApplication(applicationId: string): void {
    const application = this.getTargetApplication(applicationId);
    if (!confirm(`Are you sure you want to delete this application "${application.name}"?`)) {
      return;
    }
    this.isSessionDeleted = true;
    this.applicationService.deleteApplication(application).subscribe();
  }

  openApplicationItemFormDialog(applicationId: string | null): void {
    this.dialog.open(MainApplicationItemFormComponent, {
      width: '800px',
      height: '95vh',
      autoFocus: false,
      data: {
        workspaceId: this.workspaceId,
        application: applicationId ? this.getTargetApplication(applicationId) : null
      }
    }).afterClosed().subscribe(_ => {
    });
  }

  openApplicationWizardDialog(): void {
    this.dialog.open(MainApplicationWizardFormComponent, {
      width: '1000px',
      height: 'auto',
      maxHeight: '95vh',
      autoFocus: false,
      data: {
        workspaceId: this.workspaceId
      }
    }).afterClosed().subscribe(_ => {
    });
  }

  getApplicationIcon(labels): IconProp {
    return Utilities.getApplicationIcon(labels);
  }

  getApplicationTypeName(type): string {
    return Utilities.applicationTypeName(type);
  }
}
