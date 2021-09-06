import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvironmentTemplate } from 'src/app/models/environment-template';
import { EnvironmentTemplateService } from 'src/app/services/environment-template.service';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-main-environment-wizard-form',
  templateUrl: './main-environment-wizard-form.component.html',
  styleUrls: ['./main-environment-wizard-form.component.scss']
})
export class MainEnvironmentWizardFormComponent implements OnInit {

  wizardTemplateFormGroup: FormGroup;
  wizardProfileFormGroup: FormGroup;
  wizardOptionFormGroup: FormGroup;
  wizardPublishFormGroup: FormGroup;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedJupyterInterface: string;
  selectedDownloadMethod: string;

  get environmentTemplates(): EnvironmentTemplate[] {
    return this.environmentTemplateService.getEnvironmentTemplates();
  }

  get selectedTemplate(): EnvironmentTemplate {
    return this.environmentTemplates.find(
      x => x.id === this.wizardTemplateFormGroup.controls.templateId.value
    );
  }

  constructor(
    public dialogRef: MatDialogRef<MainEnvironmentWizardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      workspaceId: string
    },
    private formBuilder: FormBuilder,
    private environmentTemplateService: EnvironmentTemplateService,
    private environmentService: EnvironmentService,
  ) {
    console.log(this.data);
    this.selectedLabels = [];
  }

  ngOnInit(): void {
    this.selectedDownloadMethod = 'none';
    this.wizardTemplateFormGroup = this.formBuilder.group({
      templateId: ['', [Validators.required]]
    });
    this.wizardProfileFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      labels: ['']
    });
    this.wizardOptionFormGroup = this.formBuilder.group({
      jupyterInterface: ['', [Validators.required]],
      downloadMethod: [''],
      source: [''],
      isAutoExecution: [''],
      isEnableUserWorkFolder: [''],
    });
    this.wizardPublishFormGroup = this.formBuilder.group({
      isActive: ['', [Validators.required]]
    });
    // ---- Set default value
    this.wizardOptionFormGroup.controls.jupyterInterface.setValue('lab');
    this.wizardOptionFormGroup.controls.downloadMethod.setValue('none');
    this.wizardOptionFormGroup.controls.isAutoExecution.setValue(false);
    this.wizardOptionFormGroup.controls.isAutoExecution.disable();
    this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.setValue(true);
    this.wizardPublishFormGroup.controls.isActive.setValue(false);
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  createEnvironmentByWizardMode(): void {
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.wizardProfileFormGroup.controls.name.value,
      this.wizardProfileFormGroup.controls.description.value,
      this.selectedTemplate.id,
      this.selectedLabels,
      this.selectedTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.wizardOptionFormGroup.controls.jupyterInterface.value,
        download_method: this.wizardOptionFormGroup.controls.downloadMethod.value,
        download_url: this.wizardOptionFormGroup.controls.source.value,
        auto_execution: this.wizardOptionFormGroup.controls.isAutoExecution.value,
        enable_user_work_folder: this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.value,
      },
      this.wizardPublishFormGroup.controls.isActive.value
    ).subscribe((env) => {
      // console.log('created example Environment ' + env.id);
      this.closeForm();
    });
  }

  onChangeTemplate(val: string): void {
    const et = this.selectedTemplate;
    // take the default label values from the template
    if (et.base_config.labels) {
      this.selectedLabels = et.base_config.labels.slice();
    }
  }

  onChangeDownloadMethod(val: string): void {
    this.selectedDownloadMethod = val;
  }

  onChangeJupyterInterface(val: string): void {
    this.selectedJupyterInterface = val;
  }
}
