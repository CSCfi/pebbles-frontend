import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-dashboard-workspace-item',
  templateUrl: './dashboard-workspace-item.component.html',
  styleUrls: ['./dashboard-workspace-item.component.scss']
})
export class DashboardWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Input() content: any;
  @Input() selectedTabLabel: string;
  @Output() fetchWorkspacesEvent = new EventEmitter();

  // ---- Activate below when lifetime is introduced in workspace
  // lifetime: number;
  isPlainFormOn: boolean;
  showJoinCode: boolean;
  panelOpenState: boolean;
  tabLabels = ['environments', 'members'];

  get environments(): Environment[] {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  get selectedTabIndex(): number {
    if (this.selectedTabLabel) {
      return this.tabLabels.indexOf(this.selectedTabLabel);
    } else {
      return 0;
    }
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    // this.lifetime = 120; // ---- dummy value for now
    this.isPlainFormOn = false;
    this.showJoinCode = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
  }

  getEnvironmentsByWorkspaceId() {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  toggleEnvironmentList(): void {
    if (this.environments.length > 0) {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // ---- My Workspaces ---- //

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe(() => {
      this.fetchWorkspacesEvent.emit();
    });
  }

  // ---- Manage Workspaces ---- //

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        dialogTitle: 'Workspace Join Code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: this.workspace.join_code,
        dialogActions: ['close']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  openEnvironmentCreationDialog(): void {
    const dialogRef = this.dialog.open(DashboardEnvironmentFormComponent,
      {
        width: this.isPlainFormOn ? '800px' : '1000px',
        height: 'auto',
        maxHeight: '90vh',
        data: {
          isPlainFormOn: this.isPlainFormOn,
          workspaceId: this.workspace.id
        }
      });
  }

  openWorkspaceDetail(tab) {
    this.router.navigateByUrl(
      `/dashboard/workspace-owner/detail/${this.workspace.id}`,
      { state: { label: tab } });
  }

  openEditWorkspaceDialog(): void {
    const dialogRef = this.dialog.open(DashboardWorkspaceFormComponent,
      {
        width: '800px',
        height: 'auto',
        data: {
          isCreationMode: false,
          workspace: this.workspace
        }
      });
  }
}
