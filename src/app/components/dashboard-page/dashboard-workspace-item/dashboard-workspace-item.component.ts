import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';

@Component({
  selector: 'app-dashboard-workspace-item',
  templateUrl: './dashboard-workspace-item.component.html',
  styleUrls: ['./dashboard-workspace-item.component.scss']
})
export class DashboardWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Input() content: any;
  @Output() fetchUserWorkspacesEvent = new EventEmitter();

  lifetime: number;
  isPlainMode: boolean;

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
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open( DashboardEnvironmentFormComponent,
      {
      width: this.isPlainMode ? '800px' : '1000px',
      height: 'auto',
      data: {
        isPlainMode: this.isPlainMode,
        workspaceId: this.workspace.id
       }
    });
  }

  getEnvironmentsByWorkspaceId() {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  openWorkspaceDetail() {
    this.router.navigateByUrl('/dashboard/workspace-owner/detail/' + this.workspace.id);
  }

  exitWorkspace(): void {
    if (!confirm('Are you sure to exit from the workspace?')) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe(() => {
      this.fetchUserWorkspacesEvent.emit();
    });
  }
}
