import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';

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

  get workspaces(): Workspace[] {
    const workspaces = this.workspaceService.getWorkspaces().map(ws => {
      ws.name = Utilities.resetText(ws.name);
      ws.description = Utilities.resetText(ws.description);
      return ws;
    });
    return workspaces;
  }

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
    this.workspaceService.joinWorkspace(this.joinCode).subscribe((resp) => {
      this.joinWorkspaceForm.reset();
      if (typeof (resp) === 'string') {
        this.errorMessage = resp;
        return;
      }
      if (resp instanceof Object) {
        this.newWorkspace = resp;
      }
      if (this.data.context.identifier === 'my-workspaces') {
        this.closeForm();
      }
    });
  }

  closeForm(): void {
    this.dialogRef.close(this.newWorkspace);
  }
}
