import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-item-detail',
  templateUrl: './main-workspace-item-detail.component.html',
  styleUrls: ['./main-workspace-item-detail.component.scss']
})
export class MainWorkspaceItemDetailComponent implements OnInit {

  public content = {
    path: 'workspace-owner/:id/setting',
    title: 'Workspace item setting',
    identifier: 'workspace-owner-item-setting'
  };

  public workspaceId = null;
  public workspace: Workspace;
  public isWorkspaceDeleted = false;

  public workspaceEditForm: FormGroup;
  public isWorkspaceFormChanged = false;
  public isWorkspaceNameEditOn = false;
  public isWorkspaceDescriptionEditOn = false;

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
    return !this.workspace.name.startsWith('System.');
  }

  get isDeletable(): boolean {
    // System workspaces cannot be deleted
    if (this.workspace.name.startsWith('System.')) {
      return false;
    }
    // only owner or admin can delete workspaces
    return this.authService.isAdmin || this.workspace.owner_ext_id === this.userName;
  }

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, // JoinCode
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId');
      this.getWorkspaceById(this.workspaceId);
    });
  }

  ngOnInit(): void {
  }

  getWorkspaceById(workspaceId: string): void {
    this.workspaceService.fetchWorkspaces().subscribe(_ => {
      this.workspace = this.workspaceService.getWorkspaceById(workspaceId);
      if (this.workspace) {
        this.initReactiveForm(this.workspace);
        this.content.title = `Workspace: ${this.workspace.name}`;
      }
    });
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

  cancelWorkspaceEditing(): void {
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
        this.workspaceService.deleteWorkspace(this.workspace.id).subscribe(_ => {
          this.isWorkspaceDeleted = true;
        });
      }
    });
  }

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
