import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) { }

  ngOnInit(): void {
  }

  fetchUserWorkspaces(): void {
    this.workspaceService.fetchUserWorkspaces().subscribe(() => {
      console.log('User workspaces fetched');
    });
  }

  getEnvironmentsByWorkspaceId(workspaceId: string) {
    return this.environmentService.getEnvironmentsByWorkspaceId(workspaceId);
  }

  openWorkspaceDetail(workspaceId: string) {
    this.router.navigateByUrl('/dashboard/workspace-owner/detail/' + workspaceId);
  }

  exitWorkspace(workspaceId: string): void {
    if (!confirm('Are you sure to exit from the workspace?')) {
      return;
    }
    this.workspaceService.exitWorkspace(workspaceId).subscribe(() => {
      this.fetchUserWorkspaces();
    });
  }
}
