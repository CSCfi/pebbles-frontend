import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { WorkspaceService } from '../../../services/workspace.service';

@Component({
  selector: 'app-main-select-workspace-dialog',
  templateUrl: './main-select-workspace-dialog.component.html',
  styleUrls: ['./main-select-workspace-dialog.component.scss'],
  standalone: false
})
export class MainSelectWorkspaceDialogComponent implements OnInit {

  public selectWorkspaceForm: UntypedFormGroup;
  public availableWorkspaceOptions: any[];
  public heading = 'Select workspace';
  public textContent = 'Select workspace from below';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      heading: string;
      text: string;
    },
    private workspaceService: WorkspaceService,
    private dialogRef: MatDialogRef<MainSelectWorkspaceDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    const availableWorkspaces = this.workspaceService.getManagedWorkspaces(this.authService.getUserId())
      .filter(ws => !this.workspaceService.hasExpired(ws));

    this.availableWorkspaceOptions = [];
    for (let ws of availableWorkspaces) {
      this.availableWorkspaceOptions.push(
        {
          value: ws.id,
          viewValue: ws.name,
        }
      );
    }
    this.selectWorkspaceForm = this.formBuilder.group({
      selectedWorkspaceId: ['']
    });

    if (this.data.heading) {
      this.heading = this.data.heading;
    }

    if (this.data.text) {
      this.textContent = this.data.text;
    }
  }

  closeForm(): void {
    this.dialogRef.close(null);
  }

  selectWorkspace(): void {
    this.dialogRef.close(this.selectWorkspaceForm.controls.selectedWorkspaceId.value);
  }

  isFormReady(): boolean {
    return this.selectWorkspaceForm.controls.selectedWorkspaceId.value;
  }
}
