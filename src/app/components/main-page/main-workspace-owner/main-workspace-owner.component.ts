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
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-workspace-owner',
  templateUrl: './main-workspace-owner.component.html',
  styleUrls: ['./main-workspace-owner.component.scss']
})
export class MainWorkspaceOwnerComponent implements OnInit {

  public content = {
    path: 'main/workspace-owner',
    title: 'Manage workspaces',
    identifier: 'workspace-owner'
  };

  public workspaces: Workspace[] = [];
  public selectedWorkspaceId: string;
  public selectedWorkspace: Workspace;
  public newWorkspace: Workspace;
  public user: User;
  public environmentCount = 0;
  public memberCount = 0;
  public createDemoWorkspaceClickTs: number;
  public notFoundMessage = 'No workspace';

  get isDemoButtonShown(): boolean {
    // check that we know about our workspaces and that there is more than 2 seconds since the last click
    return this.workspaces.length === 0
      && Date.now() - this.createDemoWorkspaceClickTs > 2 * 1000;
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
    this.createDemoWorkspaceClickTs = 0;
  }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(_ => {
      console.log('workspaces fetched');
      this.accountService.fetchAccount(this.authService.getUserId()).subscribe(user => {
        this.user = user;
        if (this.user) {
          // ---- admins see all workspaces
          if (this.user.is_admin) {
            this.workspaces = this.workspaceService.getWorkspaces();
          } else {
            // ---- TODO: change this to managed workspaces
            // ---- return owned workspaces
            this.workspaces = this.workspaceService.getOwnedWorkspaces(this.user);
          }
        } else {
          // ---- no user fetched yet, empty result initially
          this.workspaces = [];
        }
        this.selectWorkspace();
      });
    });
  }

  getMemberCount(): void {
    this.workspaceService.fetchMemberCountByWorkspaceId(this.selectedWorkspaceId).subscribe( count => {
      this.memberCount = count;
    });
  }

  getEnvironmentCount(): void {
    // ---- MEMO: For counting environments, no need to communicate with backend.
    this.environmentCount = this.environmentService.getEnvironmentsByWorkspaceId(this.selectedWorkspaceId).length;
  }

  selectWorkspace(): void {
    if (this.route.snapshot.firstChild) {
      this.selectedWorkspaceId = this.route.snapshot.firstChild.params.workspaceId;
      this.selectedWorkspace = this.workspaces.find(x => x.id === this.selectedWorkspaceId);
      this.getMemberCount();
      this.getEnvironmentCount();
    } else {
      // ---- MEMO:
      // ---- If no workspaceId wasn't retrieved from URL,
      // ---- or we don't have the selected workspace anymore by deleting,
      // ---- display the newest workspace.
      if (this.workspaces.length > 0) {
        this.navigateToWorkspaceItem(this.workspaces[0].id);
      } else {
        this.selectedWorkspaceId = null;
        this.selectedWorkspace = null;
      }
    }
  }

  navigateToWorkspaceItem(workspaceId): void {
    this.selectedWorkspaceId = workspaceId;
    // this.getMemberCount();
    // this.getEnvironmentCount();
    this.router.navigate(['main', 'workspace-owner', workspaceId, 'environments']).then( r => {
      console.log(r);
      this.selectWorkspace();
    });
  }

  isOwner(workspace: Workspace): boolean {
    return workspace.owner_ext_id === this.user?.ext_id;
  }

  isQuotaLeft(): boolean {
    // no quota for admin
    if (this.authService.isAdmin) {
      return true;
    }
    const ownedWorkspaces = this.workspaceService.getWorkspaces().filter(x => this.isOwner(x));
    return this.user && ownedWorkspaces.length < this.user.workspace_quota;
  }

  isWorkspaceSelected(workspace: Workspace): boolean {
    return workspace.id === this.selectedWorkspaceId;
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
        this.navigateToWorkspaceItem(resp.id);
        this.fetchWorkspaces();
      }
    });
  }

  createDemoWorkspace(): void {
    console.log('creating demo workspace with example environment');
    this.createDemoWorkspaceClickTs = Date.now();
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

  openJoinCodeDialog(workspace: Workspace): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      width: '500px',
      data: {
        dialogTitle: 'Workspace join code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: workspace.join_code,
        dialogActions: ['close']
      }
    });
    dialogRef.afterClosed().subscribe( _ => {
      console.log('The dialog was closed');
    });
  }

  getExpiry_date(workspace: Workspace): string {
    const date = new Date(workspace.expiry_ts * 1000);
    return `${ date.getDate() } / ${ date.getMonth() + 1 } / ${ date.getFullYear() }`;
  }
}
