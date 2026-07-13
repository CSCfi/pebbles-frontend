import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { Workspace } from 'src/app/models/workspace';
import { SystemNotificationService } from 'src/app/services/system-notification.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-join-workspace-dialog',
  templateUrl: './main-join-workspace-dialog.component.html',
  styleUrls: ['./main-join-workspace-dialog.component.scss'],
  standalone: false
})
export class MainJoinWorkspaceDialogComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private systemNotificationService = inject(SystemNotificationService);
  dialogRef = inject<MatDialogRef<MainJoinWorkspaceDialogComponent>>(MatDialogRef);
  private formBuilder = inject(UntypedFormBuilder);
  data = inject<{
    context: Data;
  }>(MAT_DIALOG_DATA);


  public context: Data;
  public joinWorkspaceForm: UntypedFormGroup;
  public policyAcknowledged = false;

  get joinCodeControl() {
    return this.joinWorkspaceForm.get('joinCode');
  }

  get joinCode(): string {
    return this.joinCodeControl.value;
  }

  get isJoinButtonEnabled(): boolean {
    return !!this.joinCode?.trim() && this.policyAcknowledged;
  }

  ngOnInit(): void {
    this.setForm();
  }

  setForm(): void {
    this.joinWorkspaceForm = this.formBuilder.group({
      joinCode: ['']
    });
    // Clear the server-side error as soon as the user edits the code again.
    this.joinCodeControl.valueChanges.subscribe(() => this.joinCodeControl.setErrors(null));
  }

  joinWorkspace(): void {
    // clean quotes and extra spaces from the join code (sometimes present after copy-paste)
    const cleanJoinCode = this.joinCode.trim().replace(/["']/g, '');
    this.workspaceService.joinWorkspace(cleanJoinCode).subscribe(
      res => {
        this.joinWorkspaceForm.reset();
        if (res instanceof Object) {
          const newWorkspace = res as Workspace;
          this.workspaceService.fetchWorkspaces().subscribe();
          this.systemNotificationService.displayResult(`You have joined workspace "${newWorkspace.name}".`);
          this.dialogRef.close(res);
        }
      },
      error => {
        this.joinCodeControl.setErrors({serverError: error.error?.message ?? error.error});
      });
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}
