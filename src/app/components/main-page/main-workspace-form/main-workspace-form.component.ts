import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-form',
  templateUrl: './main-workspace-form.component.html',
})
export class MainWorkspaceFormComponent implements OnInit {

  workspaceForm: UntypedFormGroup;
  createButtonClicked: boolean;

  errorHandling = (control: string, error: string) => {
    return this.workspaceForm.controls[control].hasError(error);
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MainWorkspaceFormComponent>,
    private workspaceService: WorkspaceService
  ) {
  }

  ngOnInit(): void {
    this.initReactiveForm();
    this.createButtonClicked = false;
  }

  initReactiveForm(): void {
    this.workspaceForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(64),
        (control: AbstractControl) => {
          return control.value.toLowerCase().trim().startsWith("system") ? {'forbiddenValue': true} : null;
        }
      ]],
      description: ['', [Validators.required]],
    });
  }

  createWorkspace(): void {
    this.createButtonClicked = true;
    this.workspaceService.createWorkspace(
      this.workspaceForm.controls.name.value,
      this.workspaceForm.controls.description.value
    ).subscribe(
      resp => {
        this.dialogRef.close(resp);
      },
      err => {
        this.createButtonClicked = false;
      });
  }
}
