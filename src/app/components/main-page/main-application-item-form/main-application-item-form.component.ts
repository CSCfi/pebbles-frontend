import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Application } from 'src/app/models/application';
import { ApplicationTemplate, ApplicationType } from 'src/app/models/application-template';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from '../../../services/workspace.service';

export interface ApplicationTemplateRow {
  name: string;
  description: string;
  is_enabled: boolean;
  application_type: ApplicationType;
  labels: string[];
  lifetime: string;
  memory_gib: string;
}

@Component({
  selector: 'app-main-application-item-form',
  templateUrl: './main-application-item-form.component.html',
  styleUrls: ['./main-application-item-form.component.scss']
})
export class MainApplicationItemFormComponent implements OnInit {

  applicationItemEditFormGroup: FormGroup;

  isAutoExecution: boolean;
  isAlwaysPullImage: boolean;
  applicationType: ApplicationType;
  sessionLifetimeHours: number;
  sessionMemoryGiB: number;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedJupyterInterface: string;
  selectedDownloadMethod: string = null;
  selectedApplicationTemplateImage: string = null;
  applicationTemplateColumns: string[] = ['info', 'spec'];
  applicationTemplateDataSource: MatTableDataSource<ApplicationTemplateRow> = null;
  isCheckedUserWorkFolder = true;

  editButtonClicked: boolean;
  createButtonClicked: boolean;

  availableLifetimeOptions: any[];
  availableMemoryOptions: any[];

  get isCreationMode(): boolean {
    return !this.data.application;
  }

  get applicationTemplates(): ApplicationTemplate[] {
    return this.applicationTemplateService.getApplicationTemplates();
  }

  get selectedApplicationTemplate(): ApplicationTemplate {
    return this.applicationTemplateService.getApplicationTemplates().find(
      x => x.id === this.applicationItemEditFormGroup.controls.applicationTemplateId.value);
  }

  constructor(
    public dialogRef: MatDialogRef<MainApplicationItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      application: Application,
      workspaceId: string,
      isWorkspacePublic: boolean
    },
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private applicationTemplateService: ApplicationTemplateService,
    private workspaceService: WorkspaceService,
  ) {
    // TODO: Needed in case application is not available (e.g test case)
    // if (this.data.application) {
    //   this.selectedLabels = this.data.application.labels;
    // }
    this.selectedLabels = [];
  }

  ngOnInit(): void {
    this.editButtonClicked = this.createButtonClicked = false;
    this.availableLifetimeOptions = this.getLifetimeOptions();
    this.availableMemoryOptions = this.getMemoryOptions();
    if (this.isCreationMode) {
      this.setCreationForm();
    } else {
      this.setEditForm();
    }
  }

  setCreationForm(): void {
    this.applicationItemEditFormGroup = this.formBuilder.group({
      applicationTemplateId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(128)]],
      description: ['', [Validators.required]],
      labels: [''],
      jupyterInterface: [''],
      downloadMethod: [''],
      source: [''],
      isAutoExecution: [''],
      isEnableSharedFolder: [''],
      isEnableUserWorkFolder: [''],
      publish: ['', [Validators.required]],
      imageUrl: [''],
      isAlwaysPullImage: [''],
      sessionLifetimeHours: [''],
      sessionMemoryGiB: [''],
    });

    // ---- Set default value
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationItemEditFormGroup.controls.jupyterInterface.setValue('lab');
    this.applicationItemEditFormGroup.controls.downloadMethod.setValue('none');
    this.applicationItemEditFormGroup.controls.isAutoExecution.setValue(false);
    this.applicationItemEditFormGroup.controls.isAlwaysPullImage.setValue(false);
    this.applicationItemEditFormGroup.controls.isAutoExecution.disable();
    this.applicationItemEditFormGroup.controls.isEnableSharedFolder.setValue(
      this.applicationService.isSharedFolderEnabled(null, this.data.isWorkspacePublic));
    this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.setValue(true);
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationType = ApplicationType.Generic;
    this.applicationItemEditFormGroup.controls.sessionLifetimeHours.setValue(4);
    this.applicationItemEditFormGroup.controls.sessionMemoryGiB.setValue(1);
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
    ).application_type;

    this.isAlwaysPullImage = coerceBooleanProperty(this.data.application.config.always_pull_image);

    // if custom image is not present get the template base image
    if (!this.data.application.config.image_url) {
      this.data.application.config.image_url = this.applicationTemplateService.getApplicationTemplates().find(
        x => x.id === this.data.application.template_id).base_config.image;
    }

    // take maximum lifetime from config if there, fall back to application field that always has a default value
    if (this.data.application.config.maximum_lifetime) {
      this.sessionLifetimeHours = Math.floor(this.data.application.config.maximum_lifetime / 3600);
    } else {
      this.sessionLifetimeHours = Math.floor(this.data.application.maximum_lifetime / 3600);
    }

    // take memory from config if there, otherwise from info (populated from base config in the backend)
    if (this.data.application.config.memory_gib) {
      this.sessionMemoryGiB = this.data.application.config.memory_gib;
    } else {
      this.sessionMemoryGiB = this.data.application.info.memory_gib;
    }

    this.applicationItemEditFormGroup = this.formBuilder.group({
      applicationTemplateId: [{
        value: this.data.application.template_id,
        disabled: true
      }],
      name: [this.data.application.name, [Validators.required, Validators.maxLength(128)]],
      description: [this.data.application.description, [Validators.required]],
      labels: [''],
      jupyterInterface: [this.data.application.config.jupyter_interface],
      downloadMethod: [this.selectedDownloadMethod],
      source: [this.data.application.config.download_url],
      imageUrl: [this.data.application.config.image_url],
      isAlwaysPullImage: [this.isAlwaysPullImage],
      isAutoExecution: [this.isAutoExecution],
      isEnableSharedFolder: [this.applicationService.isSharedFolderEnabled(this.data.application, this.data.isWorkspacePublic)],
      isEnableUserWorkFolder: [coerceBooleanProperty(this.data.application.config.enable_user_work_folder)],
      publish: [this.data.application.is_enabled, [Validators.required]],
      sessionLifetimeHours: [this.sessionLifetimeHours],
      sessionMemoryGiB: [this.sessionMemoryGiB],
    });

    this.applicationItemEditFormGroup.controls.isAutoExecution.disable();

    this.selectedLabels = this.data.application.labels;
  }

  createApplicationByPlainMode(): void {
    this.createButtonClicked = true;
    this.applicationService.createApplication(
      this.data.workspaceId,
      this.applicationItemEditFormGroup.controls.name.value,
      this.applicationItemEditFormGroup.controls.description.value,
      this.selectedApplicationTemplate.id,
      this.selectedLabels,
      this.selectedApplicationTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.applicationItemEditFormGroup.controls.jupyterInterface.value,
        download_method: this.applicationItemEditFormGroup.controls.downloadMethod.value,
        download_url: this.applicationItemEditFormGroup.controls.source.value,
        auto_execution: this.applicationItemEditFormGroup.controls.isAutoExecution.value,
        enable_shared_folder: this.applicationItemEditFormGroup.controls.isEnableSharedFolder.value,
        enable_user_work_folder: this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value,
        image_url: this.applicationItemEditFormGroup.controls.imageUrl.value.trim(),
        always_pull_image: this.applicationItemEditFormGroup.controls.isAlwaysPullImage.value,
        maximum_lifetime: this.applicationItemEditFormGroup.controls.sessionLifetimeHours.value * 3600,
        memory_gib: this.applicationItemEditFormGroup.controls.sessionMemoryGiB.value,
      },
      this.applicationItemEditFormGroup.controls.publish.value || false,
    ).subscribe(_ => {
      this.dialogRef.close();
    });
  }

  editApplicationItem(): void {
    this.editButtonClicked = true;

    this.data.application.name = this.applicationItemEditFormGroup.controls.name.value;
    this.data.application.description = this.applicationItemEditFormGroup.controls.description.value;
    this.data.application.labels = this.selectedLabels;
    this.data.application.config.jupyter_interface = this.applicationItemEditFormGroup.controls.jupyterInterface.value;
    this.data.application.config.download_method = this.applicationItemEditFormGroup.controls.downloadMethod.value;
    this.data.application.config.download_url = this.applicationItemEditFormGroup.controls.source.value;
    this.data.application.config.auto_execution = this.applicationItemEditFormGroup.controls.isAutoExecution.value;
    this.data.application.config.enable_shared_folder = this.applicationItemEditFormGroup.controls.isEnableSharedFolder.value;
    this.data.application.config.enable_user_work_folder = this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value;
    this.data.application.config.image_url = this.applicationItemEditFormGroup.controls.imageUrl.value.trim();
    this.data.application.config.always_pull_image = this.applicationItemEditFormGroup.controls.isAlwaysPullImage.value;
    this.data.application.is_enabled = this.applicationItemEditFormGroup.controls.publish.value;
    this.data.application.config.maximum_lifetime = this.applicationItemEditFormGroup.controls.sessionLifetimeHours.value * 3600;
    this.data.application.config.memory_gib = this.applicationItemEditFormGroup.controls.sessionMemoryGiB.value;
    this.applicationService.updateApplication(
      this.data.application
    ).subscribe(_ => {
      this.dialogRef.close();
    });
  }


  onChangeApplicationTemplate(val: string): void {
    const tmpl = this.applicationTemplates.find(x => x.id === val);
    this.applicationType = tmpl.application_type;
    // take the default label values from the template
    if (tmpl.base_config.labels) {
      this.selectedLabels = tmpl.base_config.labels.slice();
    }
    this.selectedApplicationTemplateImage = tmpl.base_config.image;
    this.applicationTemplateDataSource = this.composeApplicationTemplateDataSource(this.selectedApplicationTemplate);
  }

  composeApplicationTemplateDataSource(tmpl: ApplicationTemplate): MatTableDataSource<ApplicationTemplateRow> {
    return new MatTableDataSource(
      [{
        name: tmpl.name,
        description: tmpl.description,
        labels: tmpl.base_config?.labels,
        memory_gib: tmpl.base_config?.memory_gib,
        lifetime: tmpl.base_config?.maximum_lifetime,
        application_type: tmpl.application_type,
        is_enabled: tmpl.is_enabled,
      }]
    );
  }

  onChangeDownloadMethod(val: string): void {
    this.selectedDownloadMethod = val;
  }

  onChangeUserWorkFolder(val: boolean): void {
    this.isCheckedUserWorkFolder = val;
  }

  onChangeJupyterInterface(val: string): void {
    this.selectedJupyterInterface = val;
  }

  getLifetimeOptions(): any[] {

    let res = [];
    for (let lifetimeOption of [1, 2, 4, 8, 12]) {
      res.push({value: lifetimeOption, viewValue: lifetimeOption + " h"})
    }
    return res;
  }

  getMemoryOptions(): any[] {
    // get the workspace session memory limit to calculate the number of parallel sessions per option
    const workspaceMemGiB = this.workspaceService.getWorkspaceById(this.data.workspaceId)?.memory_limit_gib;

    let res = [];
    for (let memOption of [0.5, 1, 2, 3, 4, 6, 8]) {
      res.push(
        {
          value: memOption,
          viewValue: memOption + " GiB "
            + "(" + Math.floor(workspaceMemGiB / memOption) + " concurrent sessions in workspace)",
        }
      );
    }
    return res;
  }
}
