import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: 'app-main-workspace-form',
  templateUrl: './main-workspace-form.component.html',
})
export class MainWorkspaceFormComponent implements OnInit {

  workspaceForm: UntypedFormGroup;
  createButtonClicked: boolean;
  validityOptions: any[];
  workspaceTypeOptions: any[];
  workspaceType = 'fixed-time-course';
  validityMonths = 0;
  projectedExpiryTs: number;


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
    this.validityOptions = this.createValidityOptions();
    this.workspaceTypeOptions = this.createWorkspaceTypeOptions();
    this.updateProjectedExpiryDate();
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
      workspaceType: ['fixed-time-course', [Validators.required]],
      validityMonths: [null, [Validators.required]],
    });
  }

  createWorkspace(): void {
    this.createButtonClicked = true;
    this.workspaceService.createWorkspace(
      this.workspaceForm.controls.name.value,
      this.workspaceForm.controls.description.value,
      this.projectedExpiryTs,
      this.workspaceType,
    ).subscribe(
      resp => {
        this.dialogRef.close(resp);
      },
      err => {
        console.log(err);
        this.createButtonClicked = false;
      });
  }

  createValidityOptions(): any[] {
    const res = [];
    if (this.workspaceType == 'long-running-course') {
      res.push({value: 13, viewValue: '13 months'});
    } else {
      for (let i = 1; i <= 6; i++) {
        res.push({value: i, viewValue: i + (i == 1 ? ' month' : ' months')});
      }
    }
    return res;
  }

  createWorkspaceTypeOptions(): any[] {
    return [
      {value: 'fixed-time-course', viewValue: 'Fixed-time course with limited lifetime'},
      {value: 'long-running-course', viewValue: 'Long-running course with time limited membership'},
    ];
  }

  updateProjectedExpiryDate(): void {
    this.projectedExpiryTs = Math.floor(Date.now() / 1000 + 86400 * 30 * this.validityMonths);
  }

  onWorkspaceTypeChange(): void {
    // refresh the validity options and expiry date based on selected type
    this.validityOptions = this.createValidityOptions();
    if (this.workspaceType=='long-running-course') {
      this.validityMonths = 13;
    }
    else {
      this.validityMonths = 3;
    }
    this.updateProjectedExpiryDate();
  }
}
