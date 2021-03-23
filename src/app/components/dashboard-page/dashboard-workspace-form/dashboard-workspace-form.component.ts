import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-dashboard-workspace-form',
  templateUrl: './dashboard-workspace-form.component.html',
  styleUrls: ['./dashboard-workspace-form.component.scss']
})
export class DashboardWorkspaceFormComponent implements OnInit {

  workspaceForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DashboardWorkspaceFormComponent>,
    private workspaceService: WorkspaceService,
    @Inject(MAT_DIALOG_DATA) public data: {
      isCreationMode: boolean,
      workspace?: Workspace,
    }
  ) {
  }

  ngOnInit(): void {
    this.setReactiveForm();
    if (!this.data.isCreationMode) {
      this.workspaceForm.controls.name.setValue(this.data.workspace.name);
      this.workspaceForm.controls.description.setValue(this.data.workspace.description);
    }
  }

  setReactiveForm() {
    this.workspaceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.workspaceForm.controls[control].hasError(error);
  }

  submitForm() {
    console.log(this.workspaceForm.value);
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      this.workspaceForm.controls.name.value,
      this.workspaceForm.controls.description.value
    ).subscribe(resp => {
      this.dialogRef.close(resp);
    });
  }

  updateWorkspace(): void {
    this.data.workspace.name = this.workspaceForm.controls.name.value;
    this.data.workspace.description = this.workspaceForm.controls.description.value;

    this.workspaceService.updateWorkspace(this.data.workspace).subscribe(resp => {
      console.log('updated workspace');
      this.dialogRef.close(resp);
      this.fetchWorkspaces();
    });
  }
}
