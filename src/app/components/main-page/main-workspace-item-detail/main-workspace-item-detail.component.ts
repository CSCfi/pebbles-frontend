import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LifeCycleNote, MembershipType, Workspace } from 'src/app/models/workspace';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-workspace-item-detail',
  templateUrl: './main-workspace-item-detail.component.html',
  styleUrls: ['./main-workspace-item-detail.component.scss']
})
export class MainWorkspaceItemDetailComponent implements OnChanges {

  public workspaceEditForm: UntypedFormGroup;
  public descriptionMaxLength = 500;
  public isWorkspaceNameEditOn = false;
  public isWorkspaceDescriptionEditOn = false;

  @Input() workspace: Workspace;
  @Output() workspaceDeletedEvent = new EventEmitter<string>();

  get userName(): string {
    return this.authService.getUserName();
  }

  get isEditable(): boolean {
    // System workspaces cannot be edited/deleted
    if (this.workspace.membership_type === MembershipType.Public) {
      return false;
    }
    // only owner or admin can edit/delete workspaces
    return this.authService.isAdmin || this.workspace.owner_ext_id === this.userName;
  }

  get isDeletable(): boolean {
    return this.isEditable;
  }

  get descriptionInput() {
    return this.workspaceEditForm.get('description');
  }

  constructor(
      public dialog: MatDialog,
      private formBuilder: UntypedFormBuilder,
      private workspaceService: WorkspaceService,
      private authService: AuthService,
  ) {
  }

  ngOnChanges(): void {
    this.workspace = this.workspaceService.getWorkspaceById(this.workspace.id);
    this.initReactiveForm(null);
  }

  initReactiveForm(target: string | null): void {
    // we need workspace to initialize
    if (!this.workspace) {
      return;
    }

    switch (target) {
      case 'name':
        this.isWorkspaceNameEditOn = false;
        break;
      case 'description':
        this.isWorkspaceDescriptionEditOn = false;
        break;
    }

    // this.isWorkspaceDescriptionEditOn = false;
    this.workspaceEditForm = this.formBuilder.group({
      name: [this.workspace.name, [
        Validators.required,
        Validators.maxLength(64),
        (control: AbstractControl) => {
          return control.value.toLowerCase().trim().startsWith("system") ? {'forbiddenValue': true} : null;
        }
      ]],
      description: [this.workspace.description, [
        Validators.required,
        Validators.maxLength(this.descriptionMaxLength)
      ]],
      isExtendExpiryChecked: [false],
    });
  }

  editWorkspaceName(): void {
    this.isWorkspaceNameEditOn = true;
    // this.isWorkspaceFormChanged = true;
  }

  editWorkspaceDescription(): void {
    this.isWorkspaceDescriptionEditOn = true;
    // this.isWorkspaceFormChanged = true;
  }

  cancelWorkspaceEditing(target:string): void {
    this.initReactiveForm(target);
  }

  updateWorkspace(target: string): void {
    let expiry_ts = 0;

    this.workspaceService.updateWorkspace(
        this.workspace.id,
        target === 'name' ? this.workspaceEditForm.controls.name.value: this.workspace.name,
        target === 'description' ? this.workspaceEditForm.controls.description.value: this.workspace.description,
        expiry_ts,
    ).subscribe(res => {
      // 2024-11-29 API is missing owner_ext_id field in PUT method, remove this when fixed
      if (!res.owner_ext_id) {
        res.owner_ext_id = this.workspace.owner_ext_id;
      }
      // Take the new workspace object from API response.
      // In case of name change, the join code has been regenerated as well
      this.workspace = res;
      // this.initReactiveForm();
      switch (target) {
        case 'name':
          this.isWorkspaceNameEditOn = false;
          break;
        case 'description':
          this.isWorkspaceDescriptionEditOn = false;
          break;
      }
    });
  }

  openExpiryDateExtensionDialog(): void {

    // ---- Add 13 more months from now
    const ed = new Date();
    ed.setMonth(ed.getMonth()+13);
    let expiry_ts = Math.floor(ed.valueOf()/1000);
    const yyyy = ed.getFullYear();
    const mm = String(ed.getMonth() + 1).padStart(2, '0');
    const dd = String(ed.getDate()).padStart(2, '0');

    this.dialog.open(DialogComponent, {
      width: '650px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        dialogTitle: 'Extend expiry date to 13 months from now',
        dialogContent:
            `<p>The renewed expiry date will be <b>${yyyy}-${mm}-${dd}</b>.</p>`,
        dialogActions: ['cancel', 'confirm']
      }
    }).afterClosed().subscribe((result) => {
      if (result) {

        this.workspaceService.updateWorkspace(
            this.workspace.id, this.workspace.name, this.workspace.description, expiry_ts
        ).subscribe(res => {
          this.workspace = res;
        });
      }
    });
  }

  deleteWorkspace(): void {
    this.workspaceDeletedEvent.emit(this.workspace.id);
  }

  openJoinCodeDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        dialogTitle: 'Workspace join code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: this.workspace.join_code,
        dialogActions: ['close']
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  openRegenerateJoinCodeDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '650px',
      autoFocus: false,
      data: {
        dialogTitle: 'Generate a new workspace join code',
        dialogContent: `<p>Are you sure you want to generate a new join code for <b>"${this.workspace.name}"?</b></p>` +
            `<br><p>Existing join code will not work after this, and new workspace members will need to use`+
            ` the new one to join.</p>`,
        dialogActions: ['cancel', 'confirm']
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.workspaceService.regenerateJoinCode(this.workspace.id).subscribe((res) => {
          // assign the updated workspace
          this.workspace = res;
          this.openJoinCodeDialog();
        });
      }
    });
  }

  getItemLifecycleNote() : LifeCycleNote | null {
    return this.workspaceService.getLifecycleNote(this.workspace);
  }
}
