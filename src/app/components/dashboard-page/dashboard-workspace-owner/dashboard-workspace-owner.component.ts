import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';

@Component({
  selector: 'app-dashboard-workspace-owner',
  templateUrl: './dashboard-workspace-owner.component.html',
  styleUrls: ['./dashboard-workspace-owner.component.scss']
})
export class DashboardWorkspaceOwnerComponent implements OnInit {

  public content = {
    path: 'workspace-owner',
    title: 'Workspace Owner Tool'
  };

  workspaces: Workspace[];

  constructor(
    private workspaceService: WorkspaceService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchOwnerWorkspaces().subscribe((res) => {
      console.log('owner workspaces fetched');
      this.workspaces = res;
    });
  }

  isOwner(workspace: Workspace): boolean{
    return workspace.owner_eppn === this.authService.getUserName();
  }
}
