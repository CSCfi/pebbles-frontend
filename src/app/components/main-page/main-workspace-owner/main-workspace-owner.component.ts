import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicationTemplate } from 'src/app/models/application-template';
import { UserAssociationType, Workspace } from 'src/app/models/workspace';
import { User } from '../../../models/user';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AccountService } from '../../../services/account.service';
import { EventService } from '../../../services/event.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MainWorkspaceFormComponent } from '../main-workspace-form/main-workspace-form.component';


@Component({
  selector: 'app-main-workspace-owner',
  templateUrl: './main-workspace-owner.component.html',
  styleUrls: ['./main-workspace-owner.component.scss']
})
export class MainWorkspaceOwnerComponent implements OnInit, OnDestroy {
  // store subscriptions here for unsubscribing destroy time
  private subscriptions: Subscription[] = [];
  private autoSelectFirstWorkspace = true;

  public content = {
    path: 'main/workspace-owner',
    title: 'Manage workspaces',
    identifier: 'workspace-owner'
  };

  public workspaces: Workspace[] = null;
  public selectedWorkspaceId: string;
  public selectedWorkspace: Workspace;
  public selectedTab = 0;
  public newWorkspace: Workspace;
  public user: User;
  public applicationCount = 0;
  public memberCount = 0;
  public createDemoWorkspaceClickTs: number;
  public isWorkspaceDeleted = false;
  public queryText = '';
  options: FormGroup;
  workspaceIdControl = new FormControl();

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  get isDemoButtonShown(): boolean {
    // check that we know about our workspaces and that there is more than 2 seconds since the last click
    return this.workspaces?.length === 0
      && Date.now() - this.createDemoWorkspaceClickTs > 2 * 1000;
  }

  get isNoWorkspace(): boolean {
    return this.workspaces?.length === 0;
  }

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
    private accountService: AccountService,
    private applicationService: ApplicationService,
    private applicationTemplateService: ApplicationTemplateService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.createDemoWorkspaceClickTs = 0;
    this.options = fb.group({
      workspaceId: this.workspaceIdControl
    });
  }

  ngOnInit(): void {
    // ---- Subscriptions to event Subjects
    this.subscriptions.push(this.eventService.applicationDataUpdate$.subscribe(_ => {
      this.refreshView();
    }));
    this.subscriptions.push(this.eventService.workspaceDataUpdate$.subscribe(_ => {
      this.refreshView();
    }));
    this.subscriptions.push(this.eventService.workspaceMemberDataUpdate$.subscribe(_ => {
      this.refreshView();
    }));
    this.subscriptions.push(this.eventService.userDataUpdate$.subscribe(_ => {
      this.refreshView();
    }));

    this.user = this.accountService.get(this.authService.getUserId());
    // check if we need to populate account service
    if (!this.user) {
      this.accountService.fetchAccount(this.authService.getUserId()).subscribe(user => {
        this.user = user;
        this.refreshView();
      });
      this.accountService.fetchWorkspaceAssociations(this.authService.getUserId()).subscribe();
    } else {
      this.refreshView();
    }

    // restore workspace/tab selection from queryParams if available
    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      if (paramMap.get('id')) {
        this.selectWorkspace(paramMap.get('id'));
      }
      if (paramMap.get('tab')) {
        this.selectedTab = +paramMap.get('tab');
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  refreshView(): void {
    // check if the data is there already
    if (!(this.user && this.workspaceService.isInitialized)) {
      return;
    }
    // ---- admins see all workspaces
    if (this.user.is_admin) {
      this.workspaces = this.workspaceService.getWorkspaces();
    } else {
      this.workspaces = this.workspaceService.getWorkspaces().filter( ws => {
        return ws.user_association_type === UserAssociationType.Owner || ws.user_association_type === UserAssociationType.Manager;
      });
    }

    // if no workspace selected and we have workspaces to select from, pick the first
    if (this.autoSelectFirstWorkspace && !this.selectedWorkspaceId && this.workspaces.length > 0) {
      this.selectWorkspace(this.workspaces[0].id);
      this.autoSelectFirstWorkspace = false;
    }

    // if there is a selection, update that and make sure it still exists
    if (this.selectedWorkspaceId) {
      this.selectedWorkspace = this.workspaceService.getWorkspaceById(this.selectedWorkspaceId);
      if (!this.selectedWorkspace) {
        this.selectWorkspace(null);
      }
    }
    // if there is a selected workspace, refresh the member counts
    if (this.selectedWorkspace) {
      this.memberCount = this.workspaceService.getWorkspaceMemberCount(this.selectedWorkspaceId);
      this.applicationCount = this.applicationService.getApplicationsByWorkspaceId(this.selectedWorkspaceId)?.length;
      if (!this.memberCount) {
        // service has not been populated, trigger fetching of members
        this.workspaceService.refreshWorkspaceMemberCount(this.selectedWorkspaceId);
      }
    }
  }

  selectWorkspace(workspaceId: string): void {
    if (this.selectedWorkspaceId === workspaceId) {
      return;
    }
    this.selectedWorkspaceId = workspaceId;
    this.isWorkspaceDeleted = false;

    // save the workspace selection in url parameters to restore navigation state after a reload
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {id: workspaceId},
      queryParamsHandling: 'merge'
    }).then();

    this.refreshView();
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
      autoFocus: false,
      data: {
        isCreationMode: true,
      }
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.newWorkspace = resp;
        this.selectWorkspace(resp.id);
      }
    });
  }

  createDemoWorkspace(): void {
    this.createDemoWorkspaceClickTs = Date.now();
    if (this.workspaceService.getOwnedWorkspaces(this.user).length > 0) {
      // user already has workspaces, refusing to create demo workspace
      return;
    }

    const envTemplate = this.applicationTemplateService.getApplicationTemplates().find((x) => {
      return x.name === ApplicationTemplate.EXAMPLE_TEMPLATE_NAME ? x : null;
    });
    if (!envTemplate) {
      window.alert(`Error: no template "${ApplicationTemplate.EXAMPLE_TEMPLATE_NAME}" for example application found`);
      return;
    }

    // create demo workspace
    this.workspaceService.createWorkspace(
      Workspace.DEMO_WORKSPACE_NAME,
      'Demo workspace for ' + this.authService.getUserName()
    ).subscribe((ws) => {
      // create example application that is originally enabled
      this.applicationService.createApplication(
        ws.id,
        'Demo application',
        'Demo application created by "Create Demo Workspace"',
        envTemplate.id,
        envTemplate.base_config.labels,
        envTemplate.base_config.maximum_lifetime,
        {},
        true,
      ).subscribe((env) => {
        this.selectWorkspace(ws.id);
      });
    });
  }

  openJoinCodeDialog(workspace: Workspace): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Workspace join code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: workspace.join_code,
        dialogActions: ['close']
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  openDeleteWorkspaceDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Delete Workspace',
        dialogContent: `<p>Are you sure to delete the workspace "${this.selectedWorkspace.name}"?</p>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.workspaceService.deleteWorkspace(this.selectedWorkspace.id).subscribe(_ => {
          this.isWorkspaceDeleted = true;
          this.selectedWorkspace = null;
          this.selectedWorkspaceId = null;
        });
      }
    });
  }

  getExpiry_date(workspace: Workspace): string {
    const date = new Date(workspace.expiry_ts * 1000);
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  }

  getUserAssociationType(workspace: Workspace): string {
    return workspace.user_association_type === 'manager' ? 'co-owner' : workspace.user_association_type;
  }

  handleTabChange($event: MatTabChangeEvent) {
    this.selectedTab = $event.index;

    // save the workspace selection in url parameters to restore navigation state after a reload
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {tab: this.selectedTab},
      queryParamsHandling: 'merge'
    }).then();
  }

  focusTab(idx: number): void {
    if (!this.tabGroup) {
      setTimeout(_ => this.focusTab(idx), 0);
      return;
    }
    this.tabGroup.selectedIndex = idx;
  }

  workspaceSelectChange() {
    this.selectWorkspace(this.selectedWorkspaceId);
  }
}
