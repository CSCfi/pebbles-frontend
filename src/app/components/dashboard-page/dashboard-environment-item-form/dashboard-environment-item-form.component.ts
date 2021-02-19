import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  jupyterInterface: string;
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
      this.selectedLabels = this.data.environment.labels;
    } else {
      this.selectedLabels = [];
    }
  }

  ngOnInit(): void {
    this.environmentItemEditFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      labels: ['', [Validators.required]],
      jupyterInterface: ['', [Validators.required]],
      downloadMethod: [''],
      downloadUrl: [''],
      isAutoExecution: [''],
    });
    if (this.data.environment) {
      this.environmentItemEditFormGroup.controls.name.setValue(this.data.environment.name);
      this.environmentItemEditFormGroup.controls.description.setValue(this.data.environment.description);
      this.jupyterInterface = this.data.environment.config.jupyter_interface;
      this.downloadMethod = this.data.environment.config.download_method;
      this.environmentItemEditFormGroup.controls.downloadUrl.setValue(this.data.environment.config.download_url);
      this.isAutoExecution = this.data.environment.config.auto_execution;
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  editEnvironmentItem(): void {
    this.data.environment.name = this.environmentItemEditFormGroup.controls.name.value;
    this.data.environment.description = this.environmentItemEditFormGroup.controls.description.value;
    this.data.environment.labels = this.selectedLabels;
    this.data.environment.config.jupyter_interface = this.environmentItemEditFormGroup.controls.jupyterInterface.value;
    this.data.environment.config.download_method = this.environmentItemEditFormGroup.controls.downloadMethod.value;
    this.data.environment.config.auto_execution = this.environmentItemEditFormGroup.controls.isAutoExecution.value;
    this.data.environment.config.download_url = this.environmentItemEditFormGroup.controls.downloadUrl.value;
    this.environmentService.updateEnvironment(
      this.data.environment
    ).subscribe(_ => {
      console.log('Updated environment', this.data.environment);
      this.closeForm();
    });
  }
}
