import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Environment } from 'src/app/models/environment';

@Component({
  selector: 'app-dashboard-environment-item-form',
  templateUrl: './dashboard-environment-item-form.component.html',
  styleUrls: ['./dashboard-environment-item-form.component.scss']
})
export class DashboardEnvironmentItemFormComponent implements OnInit {

  environmentItemEditFormGroup: FormGroup;
  isAutoExecution: boolean;
  downloadMethod: string;
  ide: string;
  selectedLabels: string[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DashboardEnvironmentItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      environment: Environment
    },
    private environmentService: EnvironmentService,
  ) {
      // TODO: Needed incase environment is not available (e.g test case)
      if (this.data.environment) {
        this.selectedLabels = this.data.environment.config.labels;
      }
      else {
        this.selectedLabels = [];
      }
  }

  ngOnInit(): void {
      this.environmentItemEditFormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        labels: ['', [Validators.required]],
        ide: ['', [Validators.required]],
        downloadMethod: [''],
        environmentVars: [''],
        isAutoExecution: [''],
      });
      if (this.data.environment) {
        this.ide = this.data.environment.config.ide;
        this.downloadMethod = this.data.environment.config.downloadMethod;
        this.isAutoExecution = this.data.environment.config.auto_execution;
        this.environmentItemEditFormGroup.controls.name.setValue(this.data.environment.config.name);
        this.environmentItemEditFormGroup.controls.description.setValue(this.data.environment.config.description);
        this.environmentItemEditFormGroup.controls.environmentVars.setValue(this.data.environment.config.environment_vars);
      }
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  editEnvironmentItem(): void {
    this.data.environment.config.name = this.environmentItemEditFormGroup.controls.name.value;
    this.data.environment.config.description = this.environmentItemEditFormGroup.controls.description.value;
    this.data.environment.config.ide = this.environmentItemEditFormGroup.controls.ide.value;
    this.data.environment.config.labels = this.environmentItemEditFormGroup.controls.labels.value;
    this.data.environment.config.downloadMethod = this.environmentItemEditFormGroup.controls.downloadMethod.value;
    this.data.environment.config.auto_execution = this.environmentItemEditFormGroup.controls.isAutoExecution.value;
    this.data.environment.config.environment_vars = this.environmentItemEditFormGroup.controls.environmentVars.value;
    this.environmentService.updateEnvironment(
      this.data.environment
    ).subscribe(_ => {
      console.log('Updated environment');
      this.closeForm();
    });
  }

}
