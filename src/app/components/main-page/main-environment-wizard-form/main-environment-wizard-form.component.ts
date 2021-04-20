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

  envCreationPlainFormGroup: FormGroup;
  wizardTemplateFormGroup: FormGroup;
  wizardProfileFormGroup: FormGroup;
  wizardOptionFormGroup: FormGroup;

  // ---- Values for Radio Input
  selectedTemplate: EnvironmentTemplate;
  selectedLabels: string[];
  selectedJupyterInterface: string;
  selectedDownloadMethod: string;

  get environmentTemplates() {
    return this.environmentTemplateService.getEnvironmentTemplates();
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
    });
    // ---- Set default value
    this.wizardOptionFormGroup.controls.jupyterInterface.setValue('lab');
    this.wizardOptionFormGroup.controls.downloadMethod.setValue('none');
    this.wizardOptionFormGroup.controls.isAutoExecution.setValue(false);
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  selectTemplate(event: Event) {
    // TODO: looks like this is not called
    this.selectedTemplate = this.environmentTemplates.find(x => x.id === (event.target as HTMLSelectElement).value);
  }

  createEnvironmentByPlainMode(): void {
    // TODO: this can be removed when selectTemplate() callback starts working
    this.selectedTemplate = this.environmentTemplateService.getEnvironmentTemplates().find(
      x => x.id === this.envCreationPlainFormGroup.controls.templateId.value);
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.envCreationPlainFormGroup.controls.name.value,
      this.envCreationPlainFormGroup.controls.description.value,
      this.selectedTemplate.id,
      this.selectedLabels,
      this.selectedTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.envCreationPlainFormGroup.controls.jupyterInterface.value,
        download_method: this.envCreationPlainFormGroup.controls.downloadMethod.value,
        download_url: this.envCreationPlainFormGroup.controls.source.value,
        auto_execution: this.envCreationPlainFormGroup.controls.isAutoExecution.value,
      },
      this.envCreationPlainFormGroup.controls.publish.value || false,
    ).subscribe((env) => {
      // console.log('created example Environment ' + env.id);
      this.closeForm();
    });
  }

  createEnvironmentByWizardMode(isPublic?: boolean): void {
    this.selectedTemplate = this.environmentTemplateService.getEnvironmentTemplates().find(
      x => x.id === this.wizardTemplateFormGroup.controls.templateId.value);
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
      },
      isPublic || false,
    ).subscribe((env) => {
      // console.log('created example Environment ' + env.id);
      this.closeForm();
    });
  }

  onChangeDownloadMethod(val: string) {
    this.selectedDownloadMethod = val;
  }

  onChangeJupyterInterface(val: string) {
    this.selectedJupyterInterface = val;
  }
}
