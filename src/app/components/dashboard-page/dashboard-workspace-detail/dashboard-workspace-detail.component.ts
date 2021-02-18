import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentService } from '../../../services/environment.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';

@Component({
  selector: 'app-dashboard-workspace-detail',
  templateUrl: './dashboard-workspace-detail.component.html',
  styleUrls: ['./dashboard-workspace-detail.component.scss']
})
export class DashboardWorkspaceDetailComponent implements OnInit {

  workspaceId: string;
  workspace: Workspace;
  selectedTabLabel: string;
  isPlainFormOn: boolean;
  // @Input() selectedTabLabel: string;
  tabLabels = ['environments', 'members'];

  public content = {
    path: 'workspace-owner/detail/:id',
    title: 'Workspace Detail',
    identifier: 'workspace-owner-detail'
  };

  get selectedTabIndex(): number {
    if (this.selectedTabLabel) {
      return this.tabLabels.indexOf(this.selectedTabLabel);
    } else {
      return 0;
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    this.workspaceId = this.route.snapshot.params.id;
    this.isPlainFormOn = false;
  }

  ngOnInit(): void {
    this.getWorkspaceById(this.workspaceId);
    this.environmentService.fetchEnvironments().subscribe();
    // ---- To know which button in the manage workspace was clicked
    if (window.history.state) {
      this.selectedTabLabel = window.history.state.label;
    }
  }

  getEnvironments(): Environment[] {
    const environments = this.environmentService.getEnvironmentsByWorkspaceId(this.workspaceId);
    return environments.sort((a, b) => Number(b.is_enabled) - Number(a.is_enabled));
  }

  getWorkspaceById(workspaceId: string): void {
    this.workspaceService.fetchWorkspaces().subscribe((resp) => {
      this.workspace = resp.find(ws => ws.id === workspaceId);
      this.content.title = `Workspace: ${this.workspace.name}`;
    });
  }

  openDeleteWorkspaceDialog(): void {
    // ---- TODO: code here later
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
      }).afterClosed()
      .subscribe( _ => {
        this.getEnvironments();
      });
  }

  openEnvironmentCreationDialog(mode): void {
    this.isPlainFormOn = mode === 'wizard' ? false : true;
    const dialogRef = this.dialog.open(DashboardEnvironmentFormComponent,
      {
        width: this.isPlainFormOn ? '800px' : '1000px',
        height: 'auto',
        maxHeight: '90vh',
        data: {
          isPlainFormOn: this.isPlainFormOn,
          workspaceId: this.workspace.id
        }
      }).afterClosed()
      .subscribe( _ => {
        this.getEnvironments();
      });
  }
}
