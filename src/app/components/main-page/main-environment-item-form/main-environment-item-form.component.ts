import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Environment } from 'src/app/models/environment';
import { EnvironmentTemplateService } from 'src/app/services/environment-template.service';
import { EnvironmentTemplate, EnvironmentType } from 'src/app/models/environment-template';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-main-environment-item-form',
  templateUrl: './main-environment-item-form.component.html',
  styleUrls: ['./main-environment-item-form.component.scss']
})
export class MainEnvironmentItemFormComponent implements OnInit {

  environmentItemEditFormGroup: FormGroup;

  isAutoExecution: boolean;
  environmentType: EnvironmentType;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedTemplate: EnvironmentTemplate;
  selectedJupyterInterface: string;
  selectedDownloadMethod: string = null;

  get isCreationMode(): boolean {
    return this.data.environment ? false : true;
  }

  get environmentTemplates(): EnvironmentTemplate[] {
    return this.environmentTemplateService.getEnvironmentTemplates();
  }

  constructor(
    public dialogRef: MatDialogRef<MainEnvironmentItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      environment: Environment,
      workspaceId: string
    },
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    private environmentTemplateService: EnvironmentTemplateService,
  ) {
    // TODO: Needed incase environment is not available (e.g test case)
    // if (this.data.environment) {
    //   this.selectedLabels = this.data.environment.labels;
    // }
    this.selectedLabels = [];
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.isCreationMode) {
      this.setCreationForm();
    } else {
      this.setEditForm();
    }
  }

  setCreationForm(): void {
    this.environmentItemEditFormGroup = this.formBuilder.group({
      templateId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      labels: [''],
      jupyterInterface: ['', [Validators.required]],
      downloadMethod: [''],
      source: [''],
      isAutoExecution: [''],
      publish: ['', [Validators.required]],
    });

    // ---- Set default value
    this.environmentItemEditFormGroup.controls.publish.setValue(false);
    this.environmentItemEditFormGroup.controls.jupyterInterface.setValue('lab');
    this.environmentItemEditFormGroup.controls.downloadMethod.setValue('none');
    this.environmentItemEditFormGroup.controls.isAutoExecution.setValue(false);
    this.environmentItemEditFormGroup.controls.publish.setValue(false);
    this.environmentType = EnvironmentType.Generic;
  }

  setEditForm(): void {
    // ---- If 'selectedDownloadMethod'==='none' => reset 'auto execution'.
    this.selectedDownloadMethod = this.data.environment.config.download_method;
    if (this.selectedDownloadMethod !== 'none') {
      this.isAutoExecution = this.data.environment.config.auto_execution;
    } else {
      this.isAutoExecution = false;
    }
    this.environmentType = this.environmentTemplateService.getEnvironmentTemplates().find(
      x => x.id === this.data.environment.template_id
    ).environment_type;

    this.environmentItemEditFormGroup = this.formBuilder.group({
      templateId: [{
        value: this.data.environment.template_id,
        disabled: true
      }],
      name: [this.data.environment.name, [Validators.required]],
      description: [this.data.environment.description, [Validators.required]],
      labels: ['', [Validators.required]],
      jupyterInterface: [this.data.environment.config.jupyter_interface, [Validators.required]],
      downloadMethod: [this.selectedDownloadMethod],
      source: [this.data.environment.config.download_url],
      isAutoExecution: [this.isAutoExecution],
      publish: [this.data.environment.is_enabled, [Validators.required]]
    });

    this.selectedLabels = this.data.environment.labels;
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  createEnvironmentByPlainMode(): void {
    // TODO: this can be removed when selectTemplate() callback starts working
    this.selectedTemplate = this.environmentTemplateService.getEnvironmentTemplates().find(
      x => x.id === this.environmentItemEditFormGroup.controls.templateId.value);
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.environmentItemEditFormGroup.controls.name.value,
      this.environmentItemEditFormGroup.controls.description.value,
      this.selectedTemplate.id,
      this.selectedLabels,
      this.selectedTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.environmentItemEditFormGroup.controls.jupyterInterface.value,
        download_method: this.environmentItemEditFormGroup.controls.downloadMethod.value,
        download_url: this.environmentItemEditFormGroup.controls.source.value,
        auto_execution: this.environmentItemEditFormGroup.controls.isAutoExecution.value,
      },
      this.environmentItemEditFormGroup.controls.publish.value || false,
    ).subscribe((env) => {
      console.log('created example Environment ' + env.id);
      this.closeForm();
    });
  }

  editEnvironmentItem(): void {
    this.data.environment.name = this.environmentItemEditFormGroup.controls.name.value;
    this.data.environment.description = this.environmentItemEditFormGroup.controls.description.value;
    this.data.environment.labels = this.selectedLabels;
    this.data.environment.config.jupyter_interface = this.environmentItemEditFormGroup.controls.jupyterInterface.value;
    this.data.environment.config.download_method = this.environmentItemEditFormGroup.controls.downloadMethod.value;
    this.data.environment.config.download_url = this.environmentItemEditFormGroup.controls.source.value;
    this.data.environment.config.auto_execution = this.environmentItemEditFormGroup.controls.isAutoExecution.value;
    this.data.environment.is_enabled = this.environmentItemEditFormGroup.controls.publish.value;
    this.environmentService.updateEnvironment(
      this.data.environment
    ).subscribe(_ => {
      console.log('Updated environment', this.data.environment);
      this.closeForm();
    });
  }

  onChangeTemplate(event: MatSelectChange) {
    this.environmentType = this.environmentTemplates.find(x => x.id === event.source.value).environment_type;
  }

  onChangeDownloadMethod(val: string) {
    this.selectedDownloadMethod = val;
  }

  onChangeJupyterInterface(val: string) {
    this.selectedJupyterInterface = val;
  }
}
