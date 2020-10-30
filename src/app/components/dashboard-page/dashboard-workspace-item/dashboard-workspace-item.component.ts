import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

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

  get environments(): Environment[] {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    this.lifetime = 120; // ---- dummy value for now
  }


  ngOnInit(): void {
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
