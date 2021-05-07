import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { EnvironmentService } from 'src/app/services/environment.service';
import { EnvironmentTemplateService } from 'src/app/services/environment-template.service';
import { EnvironmentTemplate } from 'src/app/models/environment-template';
import { MainWorkspaceFormComponent } from '../main-workspace-form/main-workspace-form.component';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';


@Component({
  selector: 'app-main-workspace-owner',
  templateUrl: './main-workspace-owner.component.html',
  styleUrls: ['./main-workspace-owner.component.scss']
})
export class MainWorkspaceOwnerComponent implements OnInit {

  public content = {
    path: 'workspace-owner',
    title: 'Manage workspaces',
    identifier: 'workspace-owner'
  };

  public selectedWorkspaceId: string;
  public newWorkspace: Workspace;
  public user: User;

  get workspaces(): Workspace[] {
    // admins see all workspaces
    if (this.authService.isAdmin) {
      return this.workspaceService.getWorkspaces();
    }
    // no user fetched yet, empty result initially
    if (!this.user) {
      return [];
    }
    // TODO: change this to managed workspaces
    // return owned workspaces
    return this.workspaceService.getOwnedWorkspaces(this.user);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public workspaceService: WorkspaceService,
    private authService: AuthService,
    private accountService: AccountService,
    private environmentService: EnvironmentService,
    private environmentTemplateService: EnvironmentTemplateService,
  ) {
    if (this.route.snapshot.firstChild) {
      this.selectedWorkspaceId = this.route.snapshot.firstChild.params.workspaceId;
    }
  }

  ngOnInit(): void {
    this.fetchWorkspaces();
    this.accountService.fetchAccount(this.authService.getUserId()).subscribe(user => {
      this.user = user;
    });
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe((resp) => {
      console.log('workspaces fetched');
      // If no workspaceId wasn't retrieved from URL, or we don't have the selected workspace anymore,
      // display the newest workspace.
      if (resp.filter(x => x.id === this.selectedWorkspaceId).length === 0) {
        this.selectedWorkspaceId = null;
      }
      if (!this.selectedWorkspaceId && this.workspaces?.length > 0) {
        this.viewWorkspaceItemDetail(this.workspaces[0].id);
      }
    });
  }

  viewWorkspaceItemDetail(workspaceId): void {
    this.selectedWorkspaceId = workspaceId;
    this.router.navigate(['main', 'workspace-owner', workspaceId]);
  }

  isOwner(workspace: Workspace): boolean {
    return workspace.owner_eppn === this.user?.eppn;
  }

  isQuotaLeft(): boolean {
    // no quota for admin
    if (this.authService.isAdmin) {
      return true;
    }
    const ownedWorkspaces = this.workspaceService.getWorkspaces().filter(x => this.isOwner(x));
    return this.user && ownedWorkspaces.length < this.user.workspace_quota;
  }

  // ---- workspace creation
  // ----------------------------------------
  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      'New Workspace',
      'Workspace for ' + this.authService.getUserName()
    ).subscribe(_ => {
      console.log('created new Workspace');
      this.fetchWorkspaces();
    });
  }

  isNewWorkspace(id: string): boolean {
    if (this.newWorkspace) {
      return this.newWorkspace.id === id;
    }
    return false;
  }

  openWorkspaceCreationDialog(): void {
    const dialogRef = this.dialog.open(MainWorkspaceFormComponent, {
      width: '800px',
      height: 'auto',
      data: {
        isCreationMode: true,
      }
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        console.log(`Dialog result: ${resp}`);
        this.newWorkspace = resp;
        this.selectedWorkspaceId = resp.id;
        this.viewWorkspaceItemDetail(resp.id);
        this.fetchWorkspaces();
      }
    });
  }

  createDemoWorkspace(): void {
    console.log('creating demo workspace with example environment');

    if (this.workspaceService.getOwnedWorkspaces(this.user).length > 0) {
      console.log('user already has workspaces, refusing to create demo workspace');
      return;
    }

    console.log('finding demo EnvironmentTemplate');
    const envTemplate = this.environmentTemplateService.getEnvironmentTemplates().find((x) => {
      return x.name === EnvironmentTemplate.EXAMPLE_TEMPLATE_NAME ? x : null;
    });
    if (!envTemplate) {
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
        this.fetchWorkspaces();
      });
    });
  }
}
