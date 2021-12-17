import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/models/application';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationTemplate, ApplicationType } from 'src/app/models/application-template';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-main-application-item-form',
  templateUrl: './main-application-item-form.component.html',
  styleUrls: ['./main-application-item-form.component.scss']
})
export class MainApplicationItemFormComponent implements OnInit {

  applicationItemEditFormGroup: FormGroup;

  isAutoExecution: boolean;
  isEnableUserWorkFolder: boolean;
  applicationType: ApplicationType;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedTemplate: ApplicationTemplate;
  selectedJupyterInterface: string;
  selectedDownloadMethod: string = null;
  selectedTemplateImage: string = null;

  get isCreationMode(): boolean {
    return this.data.application ? false : true;
  }

  get applicationTemplates(): ApplicationTemplate[] {
    return this.applicationTemplateService.getApplicationTemplates();
  }

  constructor(
    public dialogRef: MatDialogRef<MainApplicationItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      application: Application,
      workspaceId: string
    },
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private applicationTemplateService: ApplicationTemplateService,
  ) {
    // TODO: Needed incase application is not available (e.g test case)
    // if (this.data.application) {
    //   this.selectedLabels = this.data.application.labels;
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
    this.applicationItemEditFormGroup = this.formBuilder.group({
      templateId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      labels: [''],
      jupyterInterface: ['', [Validators.required]],
      downloadMethod: [''],
      source: [''],
      isAutoExecution: [''],
      isEnableUserWorkFolder: [''],
      publish: ['', [Validators.required]],
      imageUrl: [''],
    });

    // ---- Set default value
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationItemEditFormGroup.controls.jupyterInterface.setValue('lab');
    this.applicationItemEditFormGroup.controls.downloadMethod.setValue('none');
    this.applicationItemEditFormGroup.controls.isAutoExecution.setValue(false);
    this.applicationItemEditFormGroup.controls.isAutoExecution.disable();
    this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.setValue(true);
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationType = ApplicationType.Generic;
  }

  setEditForm(): void {
    // ---- If 'selectedDownloadMethod'==='none' => reset 'auto execution'.
    this.selectedDownloadMethod = this.data.application.config.download_method;
    if (this.selectedDownloadMethod !== 'none') {
      this.isAutoExecution = this.data.application.config.auto_execution;
    } else {
      this.isAutoExecution = false;
    }
    this.applicationType = this.applicationTemplateService.getApplicationTemplates().find(
      x => x.id === this.data.application.template_id
    ).applicationType;

    this.isEnableUserWorkFolder = coerceBooleanProperty(this.data.application.config.enable_user_work_folder);

    // if custom image is not present get the template base image
    if (!this.data.application.config.image_url) {
      this.data.application.config.image_url = this.applicationTemplateService.getApplicationTemplates().find(
       x => x.id === this.data.application.template_id).base_config.image;
    }

    this.applicationItemEditFormGroup = this.formBuilder.group({
      templateId: [{
        value: this.data.application.template_id,
        disabled: true
      }],
      name: [this.data.application.name, [Validators.required]],
      description: [this.data.application.description, [Validators.required]],
      labels: ['', [Validators.required]],
      jupyterInterface: [this.data.application.config.jupyter_interface, [Validators.required]],
      downloadMethod: [this.selectedDownloadMethod],
      source: [this.data.application.config.download_url],
      imageUrl: [this.data.application.config.image_url],
      isAutoExecution: [this.isAutoExecution],
      isEnableUserWorkFolder: [this.isEnableUserWorkFolder],
      publish: [this.data.application.is_enabled, [Validators.required]]
    });

    this.applicationItemEditFormGroup.controls.isAutoExecution.disable();

    this.selectedLabels = this.data.application.labels;
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  createApplicationByPlainMode(): void {
    // TODO: this can be removed when selectTemplate() callback starts working
    this.selectedTemplate = this.applicationTemplateService.getApplicationTemplates().find(
      x => x.id === this.applicationItemEditFormGroup.controls.templateId.value);
    this.applicationService.createApplication(
      this.data.workspaceId,
      this.applicationItemEditFormGroup.controls.name.value,
      this.applicationItemEditFormGroup.controls.description.value,
      this.selectedTemplate.id,
      this.selectedLabels,
      this.selectedTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.applicationItemEditFormGroup.controls.jupyterInterface.value,
        download_method: this.applicationItemEditFormGroup.controls.downloadMethod.value,
        download_url: this.applicationItemEditFormGroup.controls.source.value,
        auto_execution: this.applicationItemEditFormGroup.controls.isAutoExecution.value,
        enable_user_work_folder: this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value,
        image_url: this.applicationItemEditFormGroup.controls.imageUrl.value,
      },
      this.applicationItemEditFormGroup.controls.publish.value || false,
    ).subscribe((env) => {
      console.log('created example Application ' + env.id);
      this.closeForm();
    });
  }

  editApplicationItem(): void {
    this.data.application.name = this.applicationItemEditFormGroup.controls.name.value;
    this.data.application.description = this.applicationItemEditFormGroup.controls.description.value;
    this.data.application.labels = this.selectedLabels;
    this.data.application.config.jupyter_interface = this.applicationItemEditFormGroup.controls.jupyterInterface.value;
    this.data.application.config.download_method = this.applicationItemEditFormGroup.controls.downloadMethod.value;
    this.data.application.config.download_url = this.applicationItemEditFormGroup.controls.source.value;
    this.data.application.config.auto_execution = this.applicationItemEditFormGroup.controls.isAutoExecution.value;
    this.data.application.config.enable_user_work_folder = this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value;
    this.data.application.config.image_url = this.applicationItemEditFormGroup.controls.imageUrl.value,
    this.data.application.is_enabled = this.applicationItemEditFormGroup.controls.publish.value;
    this.applicationService.updateApplication(
      this.data.application
    ).subscribe(_ => {
      console.log('Updated application', this.data.application);
      this.closeForm();
    });
  }

  onChangeTemplate(event: MatSelectChange) {
    const et = this.applicationTemplates.find(x => x.id === event.source.value);
    this.applicationType = et.applicationType;
    // take the default label values from the template
    if (et.base_config.labels) {
      this.selectedLabels = et.base_config.labels.slice();
    }
    this.selectedTemplateImage = et.base_config.image;
  }

  onChangeDownloadMethod(val: string) {
    this.selectedDownloadMethod = val;
  }

  onChangeJupyterInterface(val: string) {
    this.selectedJupyterInterface = val;
  }
}
