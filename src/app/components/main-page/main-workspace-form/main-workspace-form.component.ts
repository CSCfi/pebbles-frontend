import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-form',
  templateUrl: './main-workspace-form.component.html',
})
export class MainWorkspaceFormComponent implements OnInit {

  workspaceForm: FormGroup;
  createButtonClicked: boolean;

  errorHandling = (control: string, error: string) => {
    return this.workspaceForm.controls[control].hasError(error);
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MainWorkspaceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      isCreationMode: boolean,
      workspace?: Workspace,
    },
    private workspaceService: WorkspaceService
  ) {
  }

  ngOnInit(): void {
    this.initReactiveForm();
    this.createButtonClicked = false;
    if (!this.data.isCreationMode) {
      this.workspaceForm.controls.name.setValue(this.data.workspace.name);
      this.workspaceForm.controls.description.setValue(this.data.workspace.description);
    }
  }

  initReactiveForm(): void {
    this.workspaceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      description: ['', [Validators.required]],
    });
  }

  createWorkspace(): void {
    this.createButtonClicked = true;
    this.workspaceService.createWorkspace(
      this.workspaceForm.controls.name.value,
      this.workspaceForm.controls.description.value
    ).subscribe(resp => {
      this.dialogRef.close(resp);
    });
  }
}
