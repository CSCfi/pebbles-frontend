import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MembershipType, Workspace } from 'src/app/models/workspace';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-workspace-item-detail',
  templateUrl: './main-workspace-item-detail.component.html',
  styleUrls: ['./main-workspace-item-detail.component.scss']
})
export class MainWorkspaceItemDetailComponent implements OnChanges {

  public workspace: Workspace;
  public workspaceEditForm: UntypedFormGroup;
  public isWorkspaceFormChanged = false;
  public isWorkspaceNameEditOn = false;
  public isWorkspaceDescriptionEditOn = false;

  @Input() workspaceId: string = null;
  @Output() workspaceDeletedEvent = new EventEmitter<string>();

  get userName(): string {
    return this.authService.getUserName();
  }

  get isEditable(): boolean {
    return this.workspace.membership_type !== MembershipType.Public;
  }

  get isDeletable(): boolean {
    // System workspaces cannot be deleted
    if (this.workspace.membership_type === MembershipType.Public) {
      return false;
    }
    // only owner or admin can delete workspaces
    return this.authService.isAdmin || this.workspace.owner_ext_id === this.userName;
  }

  constructor(
    public dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.workspace = this.workspaceService.getWorkspaceById(this.workspaceId);
    this.initReactiveForm();
  }

  initReactiveForm(): void {
    // we need workspace to initialize
    if (!this.workspace) {
      return;
    }
    this.isWorkspaceFormChanged = false;
    this.workspaceEditForm = this.formBuilder.group({
      name: [this.workspace.name, [
        Validators.required,
        Validators.maxLength(64),
        (control: AbstractControl) => {
          return control.value.toLowerCase().trim().startsWith("system") ? {'forbiddenValue': true} : null;
        }
      ]],
      description: [this.workspace.description, [Validators.required]],
      isExtendExpiryChecked: [false],
    });
  }

  editWorkspaceName(): void {
    this.isWorkspaceNameEditOn = true;
    this.isWorkspaceFormChanged = true;
  }

  editWorkspaceDescription(): void {
    this.isWorkspaceDescriptionEditOn = true;
    this.isWorkspaceFormChanged = true;
  }

  onExtendExpiryDateClick(): void {
    this.isWorkspaceFormChanged = !this.workspaceEditForm.controls.isExtendExpiryChecked.value
      || this.isWorkspaceNameEditOn || this.isWorkspaceDescriptionEditOn;
  }

  cancelWorkspaceEditing(): void {
    this.initReactiveForm();
    this.isWorkspaceNameEditOn = false;
    this.isWorkspaceDescriptionEditOn = false;
  }

  updateWorkspace(): void {
    let expiry_ts = 0;

    if (this.workspaceEditForm.controls.isExtendExpiryChecked.value){
      const ed = new Date();
      ed.setMonth(ed.getMonth()+13);
      expiry_ts = Math.floor(ed.valueOf()/1000);
    }

    this.workspaceService.updateWorkspace(
      this.workspaceId,
      this.workspaceEditForm.controls.name.value,
      this.workspaceEditForm.controls.description.value,
      expiry_ts,
    ).subscribe(res => {
      // Take the new workspace object from API response.
      // In case of name change, the join code has been regenerated as well
      this.workspace = res;
      this.initReactiveForm();
      this.isWorkspaceNameEditOn = false;
      this.isWorkspaceDescriptionEditOn = false;
    });
  }

  deleteWorkspace(): void {
    this.workspaceDeletedEvent.emit(this.workspaceId);
  }

  openJoinCodeDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
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

  extendValidity(): void {

  }
}
