import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<DashboardWorkspaceFormComponent>,
    private workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
      this.workspaceCreationFormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
      });
      this.workspaceCreationFormGroup.controls.name.setValue('workspace creation test');
      this.workspaceCreationFormGroup.controls.description.setValue('workspace creation test from the form.');
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  fetchOwnerWorkspaces(): void {
    this.workspaceService.fetchOwnerWorkspaces().subscribe(() => {
      console.log('owner workspaces fetched');
    });
  }

  createWorkspace(): void {
    this.workspaceService.createWorkspace(
      this.workspaceCreationFormGroup.controls.name.value,
      this.workspaceCreationFormGroup.controls.description.value
    ).subscribe(_ => {
      console.log('created new workspace');
      this.closeForm();
      this.fetchOwnerWorkspaces();
    });
  }
}
