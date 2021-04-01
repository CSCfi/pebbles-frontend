import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from '../../../services/environment.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-workspace-item-detail',
  templateUrl: './dashboard-workspace-item-detail.component.html',
  styleUrls: ['./dashboard-workspace-item-detail.component.scss']
})
export class DashboardWorkspaceItemDetailComponent implements OnInit {

  // public tabLabels = ['environments', 'members', 'info'];
  // public selectedTabLabel: string;
  public notFoundMessage = 'No workspace';

  // ---- variables for workspace environments tab
  public isPlainFormOn = false;
  public isEnvironmentCreationWizard = true;


  // ---- variables for workspace members tab
  // public members: WorkspaceUserList;

  // ---- variables for workspace info tab
  public workspaceEditForm: FormGroup;
  public isWorkspaceFormChanged = false;
  public isWorkspaceNameEditOn = false;
  public isWorkspaceDescriptionEditOn = false;

  public content = {
    path: 'workspace-owner/detail/:id',
    title: 'Workspace item Detail',
    identifier: 'workspace-owner-item-detail'
  };

  public workspaces: Workspace[];
  public workspace: Workspace;

  get userName(): string {
    return this.authService.getUserName();
  }

  get created_date(): string {
    const date = new Date(this.workspace.create_ts * 1000);
    return `${ date.getDate() } / ${ date.getMonth() + 1 } / ${ date.getFullYear() }`;
  }

  get expiry_date(): string {
    const date = new Date(this.workspace.expiry_ts * 1000);
    return `${ date.getDate() } / ${ date.getMonth() + 1 } / ${ date.getFullYear() }`;
  }

  get isEditable(): boolean {
    if (this.workspace.name === 'System.default') {
      return false;
    }
    return true;
  }

  get isDeletable(): boolean {
    if (this.workspace.name === 'System.default') {
      return false;
    }
    if (this.workspace.owner_eppn === this.userName) {
      return true;
    }
    return false;
  }

  // get selectedTabIndex(): number {
  //   if (this.selectedTabLabel) {
  //     return this.tabLabels.indexOf(this.selectedTabLabel);
  //   } else {
  //     return 0;
  //   }
  // }

  // get environments(): Environment[] {
  //   return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  // }

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, // JoinCode
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService,
    private authService: AuthService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('workspaceId');
      this.workspaceService.fetchWorkspaces().subscribe( resp => {
        this.workspaces = resp;
        this.workspace = this.workspaceService.getWorkspaceById(id);
        this.initReactiveForm(this.workspace);
      });
    });
  }

  ngOnInit(): void {

  }

  initReactiveForm(workspace: Workspace): void {
    this.isWorkspaceFormChanged = false;
    if (workspace) {
      this.workspaceEditForm = this.formBuilder.group({
        name: [workspace.name, [Validators.required]],
        description: [workspace.description, [Validators.required]],
      });
    }
  }

  editWorkspaceName(): void {
    this.isWorkspaceNameEditOn = true;
    this.isWorkspaceFormChanged = true;
  }

  editWorkspaceDescription(): void {
    this.isWorkspaceDescriptionEditOn = true;
    this.isWorkspaceFormChanged = true;
  }

  cancelChanges(): void {
    this.initReactiveForm(this.workspace);
    this.isWorkspaceNameEditOn = false;
    this.isWorkspaceDescriptionEditOn = false;
  }

  updateWorkspace(): void {
    this.workspace.name = this.workspaceEditForm.controls.name.value;
    this.workspace.description = this.workspaceEditForm.controls.description.value;

    this.workspaceService.updateWorkspace(this.workspace).subscribe(_ => {
      this.initReactiveForm(this.workspace);
      this.isWorkspaceNameEditOn = false;
      this.isWorkspaceDescriptionEditOn = false;
    });
  }

  // ---- [MEMO] Discuss later
  deleteWorkspace(): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      width: '500px',
      data: {
        dialogTitle: 'Delete Workspace',
        dialogContent: `<p>Are you sure to delete the workspace "${this.workspace.name}"?</p>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params){
        this.workspaceService.deleteWorkspace(this.workspace.id).subscribe(resp => {
          this.workspace = null;
          this.notFoundMessage = `Workspace [${resp.name}] has been successfully deleted`;
        });
      }
    });
  }

  // getEnvironments(): Environment[] {
  //   const environments = this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  //   return environments.sort((a, b) => Number(b.is_enabled) - Number(a.is_enabled));
  // }

  // getWorkspaceById(workspaceId: string): void {
  //   this.workspaceService.fetchWorkspaces().subscribe((resp) => {
  //     this.workspace = resp.find(ws => ws.id === workspaceId);
  //     this.content.title = `Workspace: ${this.workspace.name}`;
  //   });
  // }

  // openEditWorkspaceDialog(): void {
  //   const dialogRef = this.dialog.open(DashboardWorkspaceFormComponent, {
  //       width: '800px',
  //       height: 'auto',
  //       data: {
  //         isCreationMode: false,
  //         workspace: this.workspace
  //       }
  //     }).afterClosed().subscribe(_ => {
  //       this.getEnvironments();
  //     });
  // }

  // openEnvironmentCreationDialog(mode): void {
  //   this.isPlainFormOn = mode === 'wizard' ? false : true;
  //   const dialogRef = this.dialog.open(DashboardEnvironmentFormComponent, {
  //       width: this.isPlainFormOn ? '800px' : '1000px',
  //       height: 'auto',
  //       maxHeight: '90vh',
  //       data: {
  //         isPlainFormOn: this.isPlainFormOn,
  //         workspaceId: this.workspace.id
  //       }
  //     }).afterClosed().subscribe( _ => {
  //       this.getEnvironments();
  //     });
  // }

  openJoinCodeDialog(): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      width: '500px',
      data: {
        dialogTitle: 'Workspace join code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: this.workspace.join_code,
        dialogActions: ['close']
      }
    });
    dialogRef.afterClosed().subscribe( _ => {
      console.log('The dialog was closed');
    });
  }
}
