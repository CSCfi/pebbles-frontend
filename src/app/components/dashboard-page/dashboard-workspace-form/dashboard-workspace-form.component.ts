import { Component, Inject, OnInit } from '@angular/core';
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

  workspaceCreationFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      isCreationMode: boolean,
      workspace?: Workspace,
    },
    public dialogRef: MatDialogRef<DashboardWorkspaceFormComponent>,
    private workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    this.workspaceCreationFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    if (!this.data.isCreationMode) {
      this.workspaceCreationFormGroup.controls.name.setValue(this.data.workspace.name);
      this.workspaceCreationFormGroup.controls.description.setValue(this.data.workspace.description);
    }
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
      this.workspaceCreationFormGroup.controls.name.value,
      this.workspaceCreationFormGroup.controls.description.value
    ).subscribe(_ => {
      console.log('created new workspace');
      this.closeForm();
      this.fetchWorkspaces();
    });
  }

  updateWorkspace(): void {
    this.data.workspace.name = this.workspaceCreationFormGroup.controls.name.value;
    this.data.workspace.description = this.workspaceCreationFormGroup.controls.description.value;

    this.workspaceService.updateWorkspace(this.data.workspace).subscribe( _ => {
      console.log('updated workspace');
      this.closeForm();
      this.fetchWorkspaces();
    });
  }
}
