import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Data } from '@angular/router';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-join-workspace-dialog',
  templateUrl: './main-join-workspace-dialog.component.html',
  styleUrls: ['./main-join-workspace-dialog.component.scss']
})
export class MainJoinWorkspaceDialogComponent implements OnInit {

  public context: Data;
  public newWorkspace: Workspace;
  public joinWorkspaceForm: UntypedFormGroup;
  public errorMessage = '';

  get isJoinCodeValid(): boolean {
    return this.joinWorkspaceForm.get('joinCode').valid;
  }

  get joinCode(): string {
    return this.joinWorkspaceForm.get('joinCode').value;
  }

  constructor(
    private workspaceService: WorkspaceService,
    public dialogRef: MatDialogRef<MainJoinWorkspaceDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      context: Data
    },
  ) {
  }

  ngOnInit(): void {
    this.setForm();
  }

  setForm(): void {
    this.joinWorkspaceForm = this.formBuilder.group({
      joinCode: ['']
    });
  }

  joinWorkspace(): void {
    // clean quotes and extra spaces from the join code (sometimes present after copy-paste)
    const cleanJoinCode = this.joinCode.trim().replace(/["']/g, '');
    this.workspaceService.joinWorkspace(cleanJoinCode).subscribe(
      res => {
        this.joinWorkspaceForm.reset();
        if (res instanceof Object) {
          this.newWorkspace = res as Workspace;
        }
      },
      error => {
        this.errorMessage = error.error;
      });
  }

  closeForm(): void {
    this.dialogRef.close(this.newWorkspace);
  }
}
