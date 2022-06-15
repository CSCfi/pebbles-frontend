import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationTemplate, ApplicationType } from 'src/app/models/application-template';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';

export interface WizardApplicationTemplateRow {
  select: boolean;
  id: string;
  name: string;
  description: string;
  application_type: ApplicationType;
  is_enabled: boolean;
  labels: string[];
}

@Component({
  selector: 'app-main-application-wizard-form',
  templateUrl: './main-application-wizard-form.component.html',
  styleUrls: ['./main-application-wizard-form.component.scss']
})
export class MainApplicationWizardFormComponent implements OnInit {

  wizardApplicationTemplateFormGroup: FormGroup;
  wizardProfileFormGroup: FormGroup;
  wizardOptionFormGroup: FormGroup;
  wizardPublishFormGroup: FormGroup;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedJupyterInterface: string;
  selectedDownloadMethod: string;
  selectedWizardApplicationTemplateImage: string = null;

  wizardApplicationTemplateColumns: string[] = ['select', 'info', 'spec'];
  wizardApplicationTemplateDataSource: MatTableDataSource<WizardApplicationTemplateRow> = null;
  private wizardApplicationTemplateTableRowData: WizardApplicationTemplateRow[] = null;

  createButtonClicked: boolean;

  get applicationTemplates(): ApplicationTemplate[] {
    return this.applicationTemplateService.getApplicationTemplates();
  }

  get selectedWizardApplicationTemplate(): ApplicationTemplate {
    return this.applicationTemplates.find(
      x => x.id === this.wizardApplicationTemplateFormGroup.controls.templateId.value
    );
  }

  constructor(
    public dialogRef: MatDialogRef<MainApplicationWizardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      workspaceId: string
    },
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private applicationTemplateService: ApplicationTemplateService,
    private applicationService: ApplicationService,
  ) {
    this.selectedLabels = [];
  }

  ngOnInit(): void {
    this.createButtonClicked = false;

    this.rebuildWizardApplicationTemplateDataSource();

    this.selectedDownloadMethod = 'none';
    this.wizardApplicationTemplateFormGroup = this.formBuilder.group({
      templateId: ['', [Validators.required]],
      imageUrl: ['']
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
      userWorkFolderSize: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
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
    // TODO: Populate the actual value
    this.wizardOptionFormGroup.controls.userWorkFolderSize.setValue(1);
  }

  rebuildWizardApplicationTemplateDataSource(): void {
    this.wizardApplicationTemplateTableRowData = this.composeAppTmplDataSource(this.applicationTemplates);
    this.wizardApplicationTemplateDataSource =
      new MatTableDataSource<WizardApplicationTemplateRow>(this.wizardApplicationTemplateTableRowData);
  }

  composeAppTmplDataSource(templates: ApplicationTemplate[]): WizardApplicationTemplateRow[] {
    return templates.map((tmpl) => {
      return {
        select: false,
        id: tmpl.id,
        name: tmpl.name,
        description: tmpl.description,
        is_enabled: tmpl.is_enabled,
        application_type: tmpl.application_type,
        labels: tmpl.base_config?.labels,
        memory_gib: tmpl.base_config?.memory_gib,
        lifetime: tmpl.base_config?.maximum_lifetime,
      };
    });
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  createApplicationByWizardMode(): void {
    this.createButtonClicked = true;
    this.applicationService.createApplication(
      this.data.workspaceId,
      this.wizardProfileFormGroup.controls.name.value,
      this.wizardProfileFormGroup.controls.description.value,
      this.selectedWizardApplicationTemplate.id,
      this.selectedLabels,
      this.selectedWizardApplicationTemplate.base_config.maximum_lifetime,
      {
        jupyter_interface: this.wizardOptionFormGroup.controls.jupyterInterface.value,
        download_method: this.wizardOptionFormGroup.controls.downloadMethod.value,
        download_url: this.wizardOptionFormGroup.controls.source.value,
        auto_execution: this.wizardOptionFormGroup.controls.isAutoExecution.value,
        enable_user_work_folder: this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.value,
        user_work_folder_size: this.wizardOptionFormGroup.controls.userWorkFolderSize.value,
        image_url: this.wizardApplicationTemplateFormGroup.controls.imageUrl.value,
      },
      this.wizardPublishFormGroup.controls.isActive.value
    ).subscribe(_ => {
      this.closeForm();
    });
  }

  onChangeWizardApplicationTemplate(): void {
    const et = this.selectedWizardApplicationTemplate;
    // take the default label values from the template
    if (et.base_config.labels) {
      this.selectedLabels = et.base_config.labels.slice();
    }
    this.selectedWizardApplicationTemplateImage = et.base_config.image;
  }

  onChangeDownloadMethod(val: string): void {
    this.selectedDownloadMethod = val;
  }

  onChangeJupyterInterface(val: string): void {
    this.selectedJupyterInterface = val;
  }
}
