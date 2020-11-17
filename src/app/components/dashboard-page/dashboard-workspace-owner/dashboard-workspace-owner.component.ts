import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { EnvironmentService } from 'src/app/services/environment.service';
import { EnvironmentTemplateService } from 'src/app/services/environment-template.service';
import { EnvironmentTemplate } from 'src/app/models/environment-template';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';

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

  get workspaces(): Workspace[] {
    return this.workspaceService.getOwnerWorkspaces();
  }

  constructor(
    public dialog: MatDialog,
    public workspaceService: WorkspaceService,
    private authService: AuthService,
    private environmentService: EnvironmentService,
    private environmentTemplateService: EnvironmentTemplateService,
  ) {
  }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchOwnerWorkspaces().subscribe((resp) => {
      console.log('owner workspaces fetched');
    });
  }

  isOwner(workspace: Workspace): boolean {
    return workspace.owner_eppn === this.authService.getUserName();
  }

  openDialog(): void {
    this.dialog.open( DashboardWorkspaceFormComponent, {
      width: '800px',
      height: 'auto',
      data: {
      }
    });
  }

  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      Workspace.DEMO_WORKSPACE_NAME,
      'Demo workspace for ' + this.authService.getUserName()
    ).subscribe(_ => {
      console.log('created new Workspace');
      this.fetchWorkspaces();
    });
  }

  createDemoWorkspace() {
    console.log('creating demo workspace with example environment');

    if (this.workspaceService.getOwnerWorkspaces().length > 0) {
      console.log('user already has workspaces, refusing to create demo workspace');
      return;
    }

    console.log('finding demo EnvironmentTemplate');
    const envTemplate = this.environmentTemplateService.getEnvironmentTemplates().find((x) => {
      return x.name === EnvironmentTemplate.EXAMPLE_TEMPLATE_NAME ? x : null;
    });
    if (! envTemplate) {
      console.log(`no template "${EnvironmentTemplate.EXAMPLE_TEMPLATE_NAME}" for example environment found`);
      return;
    }

    // create demo workspace
    this.workspaceService.createWorkspace(
      Workspace.DEMO_WORKSPACE_NAME,
      'Demo workspace for ' + this.authService.getUserName()
    ).subscribe((ws) => {
      console.log('created demo Workspace ' + ws.id);
      console.log('creating example Environment');
      // create example environment that is originally enabled
      this.environmentService.createEnvironment(
        ws.id,
        'Demo Environment',
        envTemplate.id,
        {description: 'Demo Environment created by "Create Demo Workspace"'},
        true,
      ).subscribe((env) => {
        console.log('created example Environment ' + env.id);
      });
    });
    this.fetchWorkspaces();
  }

  // deleteWorkspace(workspaceId: string): void {
  //   this.workspaceService.deleteWorkspace(workspaceId).subscribe(() => {
  //     this.fetchWorkspaces();
  //   });
  // }
}
