import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-form',
  templateUrl: './main-workspace-form.component.html',
  styleUrls: ['./main-workspace-form.component.scss']
})
export class MainWorkspaceFormComponent implements OnInit {

  public workspaceForm: FormGroup;

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
    if (!this.data.isCreationMode) {
      this.workspaceForm.controls.name.setValue(this.data.workspace.name);
      this.workspaceForm.controls.description.setValue(this.data.workspace.description);
    }
  }

  initReactiveForm(): void {
    this.workspaceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      this.workspaceForm.controls.name.value,
      this.workspaceForm.controls.description.value
    ).subscribe(resp => {
      this.dialogRef.close(resp);
    });
  }
}
