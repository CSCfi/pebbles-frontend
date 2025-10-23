import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicationTemplate } from 'src/app/models/application-template';
import { LifeCycleNote, MembershipType, Workspace } from 'src/app/models/workspace';
import { User } from 'src/app/models/user';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AccountService } from 'src/app/services/account.service';
import { EventService } from 'src/app/services/event.service';
import { PublicConfigService } from 'src/app/services/public-config.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MainWorkspaceFormComponent } from '../main-workspace-form/main-workspace-form.component';

export enum TabType {
  Applications,
  Members,
  CustomImages,
  Config,
}

@Component({
  selector: 'app-main-workspace-owner',
  templateUrl: './main-workspace-owner.component.html',
  styleUrls: ['./main-workspace-owner.component.scss'],
  standalone: false
})
export class MainWorkspaceOwnerComponent implements OnInit, AfterViewInit, OnDestroy {

  public context: Data;
  public workspaces: Workspace[] = null;
  public isWorkspaceDeleted = false;
  public selectedTabType: TabType = TabType.Applications;
  public workspaceIdControl = new FormControl<string>('');
  public isAppFormOpen: boolean;
  public selectedApplicationId: string;

  protected readonly TabType = TabType;

  // store subscriptions here for unsubscribing destroy time
  private subscriptions: Subscription[] = [];
  private autoSelectFirstWorkspace = true;
  private selectedWorkspaceId: string;
  private user: User;
  private createDemoWorkspaceClickTs: number;

  @ViewChild(MatTabGroup) private tabGroup: MatTabGroup;
  @ViewChild('customImagesTabLabel', {read: ElementRef}) private customImagesTabLabel!: ElementRef;

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
    private publicConfigService: PublicConfigService,
  ) {
    this.createDemoWorkspaceClickTs = 0;
  }

  get isDemoButtonShown(): boolean {
    // check that we know about our workspaces and that there is more than 2 seconds since the last click
    return this.workspaces?.length === 0
      && Date.now() - this.createDemoWorkspaceClickTs > 2 * 1000;
  }

  get isNoWorkspace(): boolean {
    return this.workspaces?.length === 0;
  }

  get isCustomImagesFeatureEnabled(): boolean {
    return this.publicConfigService.isFeatureEnabled('customImages');
  }

  get isWorkspaceExpired(): boolean {
    return this.workspaceService.hasExpired(this.selectedWorkspace);
  }

  get selectedWorkspace(): Workspace {
    return this.workspaceService.getWorkspaceById(this.selectedWorkspaceId);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
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
      this.accountService.fetchWorkspaceMemberships(this.authService.getUserId()).subscribe();
    } else {
      this.refreshView();
    }

    // restore workspace/tab selection from queryParams if available
    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      if (paramMap.get('id')) {
        this.selectedWorkspaceId = paramMap.get('id');
      }
      if (paramMap.get('tab')) {
        if (paramMap.get('tab') === 'undefined') {
          this.selectedTabType = TabType.Applications;
        } else {
          this.selectedTabType = +paramMap.get('tab');
        }
      } else {
        this.selectedTabType = TabType.Applications;
      }
      if (paramMap.get('edit')) {
        this.isAppFormOpen = true;
        if (paramMap.get('edit') !== 'new') {
          this.selectedApplicationId = paramMap.get('edit');
        } else {
          this.selectedApplicationId = 'new';
        }
      } else {
        this.isAppFormOpen = false;
      }

      this.refreshView();
    });
  }

  ngAfterViewInit() {
    this.eventService.uiEffect$.subscribe((isStarting) => {
      this.triggerCustomImageTabLabelShake(isStarting);
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  isManageableWorkspace(ws: Workspace): boolean {
    return (
      ws.membership_type === MembershipType.Owner ||
      ws.membership_type === MembershipType.Manager
    );
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
      // list manageable workspaces
      this.workspaces = this.workspaceService.getWorkspaces().filter(this.isManageableWorkspace);
    }
    this.workspaces = Workspace.sortWorkspaces(this.workspaces, ['expiry', 'role', 'create_ts']);
    this.workspaceIdControl = new FormControl<string>(this.selectedWorkspaceId);

    // if no workspace selected, and we have workspaces to select from, pick the first
    if (this.autoSelectFirstWorkspace && !this.selectedWorkspaceId && this.workspaces.length > 0) {
      this.selectWorkspace(this.workspaces[0].id, TabType.Applications);
      this.autoSelectFirstWorkspace = false;
    }
  }

  selectWorkspace(workspaceId: string, tabType: TabType | undefined): void {
    if (this.isWorkspaceDeleted) {
      tabType = TabType.Applications;
    }
    this.isWorkspaceDeleted = false;
    // save the workspace selection in url parameters to restore navigation state after a reload
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        id: workspaceId,
        tab: tabType,
        edit: null
      },
      queryParamsHandling: 'merge'
    }).then(() => {
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

  openWorkspaceCreationDialog(): void {
    const dialogRef = this.dialog.open(MainWorkspaceFormComponent, {
      width: '800px',
      height: '700px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.selectWorkspace(resp.id, TabType.Applications);
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
        {download_method: 'none', memory_gib: 1.0},
        true,
      ).subscribe(_ => {
        this.applicationService.fetchApplications().subscribe(_ => {
          this.selectWorkspace(ws.id, TabType.Applications);
        });
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
    let ws = this.workspaceService.getWorkspaceById(this.selectedWorkspaceId);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Delete Workspace',
        dialogContent: `<p>Are you sure to delete the workspace "${ws.name}"?</p>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.workspaceService.deleteWorkspace(ws.id).subscribe(() => {
          this.isWorkspaceDeleted = true;
        });
      }
    });
  }

  getMembershipType(workspace: Workspace): string {
    return workspace.membership_type === 'manager' ? 'co-owner' : workspace.membership_type;
  }

  handleTabChange($event: MatTabChangeEvent): void {

    this.selectedTabType = $event.index;

    // save the workspace selection in url parameters to restore navigation state after a reload
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tab: this.selectedTabType,
        edit: null
      },
      queryParamsHandling: 'merge'
    }).then();
  }

  focusTab(idx: number): void {
    if (!this.tabGroup) {
      setTimeout(() => this.focusTab(idx), 0);
      return;
    }
    this.tabGroup.selectedIndex = idx;
  }

  openCourseRequest(): void {
    window.open(this.publicConfigService.getCourseRequestFormUrl(), '_blank');
  }

  getWorkspaceById(id: string): Workspace {
    return this.workspaceService.getWorkspaceById(id);
  }

  getItemLifecycleNote(workspace: Workspace): LifeCycleNote | null {
    return this.workspaceService.getLifecycleNote(workspace);
  }

  getWorkspaceClasses(workspace: Workspace) {
    if (!workspace) {
      return {};
    }

    return {
      'selected': this.isWorkspaceSelected(workspace),
      [this.getItemLifecycleNote(workspace)]: true,
      [this.getMembershipType(workspace)]: true
    };
  }

  closeForm() {
    this.isAppFormOpen = false;
  }

  triggerCustomImageTabLabelShake(isStarting: boolean): void {
    if (!this.customImagesTabLabel) {
      return;
    }
    const el = this.customImagesTabLabel.nativeElement;
    const label = el.querySelector('#mat-tab-label-0-2') || el;

    if (isStarting) {
      label.classList.add('shake-vertical');
    } else {
      setTimeout(() => label.classList.remove('shake-vertical'), 400);
    }
  }

  getContactEmail(): string {
    return this.publicConfigService.getContactEmail();
  }
}

