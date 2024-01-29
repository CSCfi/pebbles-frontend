import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ApplicationTemplate, ApplicationType } from 'src/app/models/application-template';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainApplicationItemFormComponent } from '../main-application-item-form/main-application-item-form.component';

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

  wizardApplicationTemplateFormGroup: UntypedFormGroup;
  wizardProfileFormGroup: UntypedFormGroup;
  wizardOptionFormGroup: UntypedFormGroup;
  wizardPublishFormGroup: UntypedFormGroup;

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedDownloadMethod: string;
  selectedWizardApplicationTemplateImage: string = null;
  isCheckedUserWorkFolder = true;

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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<MainApplicationWizardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      workspaceId: string,
      isWorkspacePublic: boolean
    },
    public authService: AuthService,
    private formBuilder: UntypedFormBuilder,
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
      name: ['', [Validators.required, Validators.maxLength(128)]],
      description: ['', [Validators.required]],
      labels: ['']
    });
    this.wizardOptionFormGroup = this.formBuilder.group({
      downloadMethod: [''],
      source: [''],
      isAutoExecution: [''],
      isEnableSharedFolder: [''],
      isEnableUserWorkFolder: [''],
    });
    this.wizardPublishFormGroup = this.formBuilder.group({
      isActive: ['', [Validators.required]]
    });
    // ---- Set default value
    this.wizardOptionFormGroup.controls.downloadMethod.setValue('none');
    this.wizardOptionFormGroup.controls.isAutoExecution.setValue(false);
    this.wizardOptionFormGroup.controls.isAutoExecution.disable();
    this.wizardOptionFormGroup.controls.isEnableSharedFolder.setValue(!this.data.isWorkspacePublic);
    this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.setValue(!this.data.isWorkspacePublic);
    this.wizardPublishFormGroup.controls.isActive.setValue(false);

    // public workspaces cannot have persistent folders ATM
    if (this.data.isWorkspacePublic) {
      this.wizardOptionFormGroup.controls.isEnableSharedFolder.disable();
      this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.disable();
    }
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

  createApplicationByWizardMode(isOpeningAdvancedEditor:boolean): void {
    this.createButtonClicked = true;
    this.applicationService.createApplication(
      this.data.workspaceId,
      this.wizardProfileFormGroup.controls.name.value,
      this.wizardProfileFormGroup.controls.description.value,
      this.selectedWizardApplicationTemplate.id,
      this.selectedLabels,
      this.selectedWizardApplicationTemplate.base_config.maximum_lifetime,
      {
        download_method: this.wizardOptionFormGroup.controls.downloadMethod.value,
        download_url: this.wizardOptionFormGroup.controls.source.value,
        auto_execution: this.wizardOptionFormGroup.controls.isAutoExecution.value,
        enable_shared_folder: this.data.isWorkspacePublic ? false : this.wizardOptionFormGroup.controls.isEnableSharedFolder.value,
        enable_user_work_folder: this.wizardOptionFormGroup.controls.isEnableUserWorkFolder.value,
        image_url: this.wizardApplicationTemplateFormGroup.controls.imageUrl.value,
      },
      this.wizardPublishFormGroup.controls.isActive.value
    ).subscribe(application => {
      this.dialogRef.close();
      if (isOpeningAdvancedEditor) {
            this.dialog.open(MainApplicationItemFormComponent, {
            width: '800px',
            height: '95vh',
            autoFocus: false,
            data: {
              workspaceId: this.data.workspaceId,
              application: application,
              isWorkspacePublic: this.data.isWorkspacePublic
            }
          }).afterClosed().subscribe();
      }
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

  onChangeUserWorkFolder(val: boolean): void {
    this.isCheckedUserWorkFolder = val;
  }
}
