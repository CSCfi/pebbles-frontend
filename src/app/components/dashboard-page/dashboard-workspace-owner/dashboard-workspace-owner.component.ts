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
    title: 'Manage workspaces',
    identifier: 'workspace-owner'
  };

  get workspaces(): Workspace[] {
    return this.workspaceService.getWorkspaces();
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
    this.environmentService.fetchEnvironments().subscribe();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe((resp) => {
      console.log('workspaces fetched');
    });
  }

  isOwner(workspace: Workspace): boolean {
    return workspace.owner_eppn === this.authService.getUserName();
  }

  openWorkspaceCreationDialog(): void {
    this.dialog.open( DashboardWorkspaceFormComponent, {
      width: '800px',
      height: 'auto',
      data: {
        isCreationMode: true,
      }
    });
  }

  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      'New Workspace',
      'Workspace for ' + this.authService.getUserName()
    ).subscribe(_ => {
      console.log('created new Workspace');
      this.fetchWorkspaces();
    });
  }

  createDemoWorkspace() {
    console.log('creating demo workspace with example environment');

    if (this.workspaceService.getWorkspaces().length > 0) {
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
        'Demo Environment created by "Create Demo Workspace"',
        envTemplate.id,
        envTemplate.base_config.labels,
        envTemplate.base_config.maximum_lifetime,
        {},
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
