import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';

@Component({
  selector: 'app-dashboard-workspace-item',
  templateUrl: './dashboard-workspace-item.component.html',
  styleUrls: ['./dashboard-workspace-item.component.scss']
})
export class DashboardWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Input() content: any;
  @Output() fetchWorkspacesEvent = new EventEmitter();

  lifetime: number;
  isPlainMode: boolean;
  showJoinCode: boolean;
  panelOpenState: boolean;

  get environments(): Environment[] {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    this.lifetime = 120; // ---- dummy value for now
    this.isPlainMode = false;
    this.showJoinCode = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
  }

  // ---- Workspace Card UI ---- //

  toggleEnvironmentList(): void {
    if ( this.environments.length > 0 ){
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // ---- Environment ---- //

  openEnvironmentCreationDialog(): void {
    const dialogRef = this.dialog.open( DashboardEnvironmentFormComponent,
      {
      width: this.isPlainMode ? '800px' : '1000px',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        isPlainMode: this.isPlainMode,
        workspaceId: this.workspace.id
       }
    });
  }

  getEnvironmentsByWorkspaceId() {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  // ---- Workspace ---- //

  openWorkspaceDetail() {
    this.router.navigateByUrl('/dashboard/workspace-owner/detail/' + this.workspace.id);
  }

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe(() => {
      this.fetchWorkspacesEvent.emit();
    });
  }

  openEditWorkspaceDialog(): void {
    const dialogRef = this.dialog.open( DashboardWorkspaceFormComponent,
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
