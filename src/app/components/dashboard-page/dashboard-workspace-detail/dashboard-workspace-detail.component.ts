import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentService } from '../../../services/environment.service';

@Component({
  selector: 'app-dashboard-workspace-detail',
  templateUrl: './dashboard-workspace-detail.component.html',
  styleUrls: ['./dashboard-workspace-detail.component.scss']
})
export class DashboardWorkspaceDetailComponent implements OnInit {

  workspaceId: string;
  workspace: Workspace;

  public content = {
    path: 'workspace-owner/detail/:id',
    title: 'Workspace Detail'
  };

  constructor(
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    this.workspaceId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getWorkspaceById(this.workspaceId);
    this.environmentService.fetchEnvironments().subscribe();
  }

  getWorkspaceById(workspaceId: string): void {
    this.workspaceService.fetchWorkspaces().subscribe((resp) => {
      console.log(resp);
      this.workspace = resp.find( ws => ws.id === workspaceId );
    });
  }
}
