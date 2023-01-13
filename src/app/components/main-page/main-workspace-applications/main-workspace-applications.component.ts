import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Subscription } from 'rxjs';
import { Application } from 'src/app/models/application';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationType } from '../../../models/application-template';
import { EventService } from '../../../services/event.service';
import { PublicConfigService } from '../../../services/public-config.service';
import { SystemNotificationService } from '../../../services/system-notification.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { Utilities } from '../../../utilities';
import { MainApplicationItemFormComponent } from '../main-application-item-form/main-application-item-form.component';
import {
  MainApplicationWizardFormComponent
} from '../main-application-wizard-form/main-application-wizard-form.component';
import {
  MainSelectWorkspaceDialogComponent
} from '../main-select-workspace-dialog/main-select-workspace-dialog.component';

export interface ApplicationRow {
  select: boolean;
  index: number;
  id: string;
  name: string;
  description: string;
  type: ApplicationType;
  isEnabled: boolean;
  lifetime: number;
  labels: string[];
  sessionId: string;
  workspaceName: string;
  memory: number;
  sharedFolderEnabled: boolean;
  workFolderEnabled: boolean;
  maximumConcurrentSessions: number,
}

@Component({
  selector: 'app-main-workspace-applications',
  templateUrl: './main-workspace-applications.component.html',
  styleUrls: ['./main-workspace-applications.component.scss']
})
export class MainWorkspaceApplicationsComponent implements OnInit, OnDestroy, OnChanges {

  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

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
  @Input() isWorkspaceExpired = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private eventService: EventService,
    private workspaceService: WorkspaceService,
    private systemNotificationService: SystemNotificationService,
    public publicConfigService: PublicConfigService,
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
    // we need the applicationService to be ready
    if (!this.applicationService.isInitialized) {
      return;
    }
    // wait for paginator to be initialized by Angular, otherwise defer to next tick
    if (!(this.paginator)) {
      setTimeout(() => this.rebuildDataSource(), 0);
      return;
    }
    const applications = this.applicationService.getApplicationsByWorkspaceId(this.workspaceId).sort(
      (a, b) => Number(b.is_enabled) - Number(a.is_enabled));
    this.dataSource = this.composeDataSource(applications);
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.dataSource, this.minUnitNumber);
    this.isPaginatorVisible = this.dataSource.data.length > this.minUnitNumber;
    this.paginator.length = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
  }

  composeDataSource(applications: Application[]): MatTableDataSource<ApplicationRow> {
    const workspace = this.workspaceService.getWorkspaceById(this.workspaceId);
    return new MatTableDataSource(
      applications.map((app, i) => {
        return {
          select: false,
          isEnabled: app.is_enabled,
          index: i,
          id: app.id,
          name: app.name,
          template: app.template_name,
          description: app.description,
          type: app.application_type,
          lifetime: app.maximum_lifetime,
          labels: app.labels,
          sessionId: app.session_id,
          workspaceName: app.workspace_name,
          workFolderEnabled: app.info?.work_folder_enabled,
          sharedFolderEnabled: this.applicationService.isSharedFolderEnabled(
            app, app.workspace_name.startsWith('System.')),
          memory: app.info?.memory,
          maximumConcurrentSessions: Math.trunc(workspace.memory_limit_gib / app.info.memory_gib),
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

  openCopyApplicationDialog(applicationId: string): void {
    const application = this.getTargetApplication(applicationId);
    this.dialog.open(MainSelectWorkspaceDialogComponent, {
      width: '800px',
      height: 'auto',
      maxHeight: '95vh',
      data: {
        heading: `Copying application "${application.name}"`,
        text: 'Select target workspace for copy below.',
      }
    }).afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const targetWs = this.workspaceService.getWorkspaceById(res);
      this.applicationService.copyApplication(application, targetWs.id).subscribe(_ => {
        this.systemNotificationService.displayResult(
          `Application "${application.name}" was copied to workspace "${targetWs.name}".`);
      });
    });
  }

  deleteApplication(applicationId: string): void {
    const application = this.getTargetApplication(applicationId);
    if (!confirm(`Are you sure you want to delete this application "${application.name}"?`)) {
      return;
    }
    this.applicationService.deleteApplication(application).subscribe();
  }

  openApplicationItemFormDialog(applicationId: string | null): void {
    this.dialog.open(MainApplicationItemFormComponent, {
      width: '800px',
      height: '95vh',
      autoFocus: false,
      data: {
        workspaceId: this.workspaceId,
        application: applicationId ? this.getTargetApplication(applicationId) : null,
        isWorkspacePublic: this.workspaceService.getWorkspaceById(this.workspaceId).name.startsWith('System.')
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
        workspaceId: this.workspaceId,
        isWorkspacePublic: this.workspaceService.getWorkspaceById(this.workspaceId).name.startsWith('System.')
      }
    }).afterClosed().subscribe(_ => {
    });
  }

  getApplicationIcon(labels): IconProp {
    return this.applicationService.getApplicationIcon(labels);
  }

  getApplicationTypeName(type): string {
    return this.applicationService.applicationTypeName(type);
  }
}
