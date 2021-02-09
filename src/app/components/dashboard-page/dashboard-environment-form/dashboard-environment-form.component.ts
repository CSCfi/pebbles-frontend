import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvironmentTemplate } from 'src/app/models/environment-template';
import { EnvironmentTemplateService } from 'src/app/services/environment-template.service';
import { EnvironmentService } from 'src/app/services/environment.service';
import { EnvironmentCategoryService } from 'src/app/services/environment-category.service';

@Component({
  selector: 'app-dashboard-environment-form',
  templateUrl: './dashboard-environment-form.component.html',
  styleUrls: ['./dashboard-environment-form.component.scss']
})
export class DashboardEnvironmentFormComponent implements OnInit {

  envCreationPlainFormGroup: FormGroup;
  isLinear: boolean;
  wizardTemplateFormGroup: FormGroup;
  wizardProfileFormGroup: FormGroup;
  wizardOptionFormGroup: FormGroup;

  // ---- Values for Radio Input
  selectedTemplate: EnvironmentTemplate;
  selectedLabels: string[];
  selectedIde: string;
  selectedDownloadMethod: string;

  get environmentTemplates() {
    return this.environmentTemplateService.getEnvironmentTemplates();
  }

  constructor(
    public dialogRef: MatDialogRef<DashboardEnvironmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      isPlainMode: boolean,
      workspaceId: string
    },
    private formBuilder: FormBuilder,
    private environmentTemplateService: EnvironmentTemplateService,
    private environmentService: EnvironmentService,
    private catalogService: EnvironmentCategoryService,
  ) {
    console.log(this.data);
    this.selectedLabels = [];
  }

  ngOnInit(): void {

    this.selectedDownloadMethod = 'none';

    if (this.data.isPlainMode) {
      console.log('----> plain mode');
      this.envCreationPlainFormGroup = this.formBuilder.group({
        templateId: ['', [Validators.required]],
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        labels: [''],
        ide: [''],
        downloadMethod: [''],
        source: [''],
        isAutoExecution: [''],
        publish: ['', [Validators.required]],
      });

      // ---- Set default value
      this.envCreationPlainFormGroup.controls.publish.setValue(false);
      this.envCreationPlainFormGroup.controls.ide.setValue('jupyter');
      this.envCreationPlainFormGroup.controls.downloadMethod.setValue('none');
      this.envCreationPlainFormGroup.controls.isAutoExecution.setValue(false);
      this.envCreationPlainFormGroup.controls.publish.setValue(false);

    } else {
      // ---- Mat Stepper Setting
      this.isLinear = true;

      this.wizardTemplateFormGroup = this.formBuilder.group({
        templateId: ['', [Validators.required]]
      });
      this.wizardProfileFormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        labels: ['']
      });
      this.wizardOptionFormGroup = this.formBuilder.group({
        ide: ['', [Validators.required]],
        downloadMethod: [''],
        source: [''],
        isAutoExecution: [''],
      });
      // ---- Set default value
      this.wizardOptionFormGroup.controls.ide.setValue('jupyter');
      this.wizardOptionFormGroup.controls.downloadMethod.setValue('none');
      this.wizardOptionFormGroup.controls.isAutoExecution.setValue(false);
    }

  }

  closeForm(): void {
    this.dialogRef.close();
  }

  selectTemplate(event: Event) {
    // TODO: looks like this is not called
    this.selectedTemplate = this.environmentTemplates.find(x => x.id === (event.target as HTMLSelectElement).value);
  }

  fetchEnvironments(): void {
    this.environmentService.fetchEnvironments().subscribe(() => {
      console.log('environments fetched');
    });
  }

  createEnvironmentByPlainMode(): void {
    // TODO: this can be removed when selectTemplate() callback starts working
    this.selectedTemplate = this.environmentTemplateService.getEnvironmentTemplates().find(
      x => x.id === this.envCreationPlainFormGroup.controls.templateId.value );
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.envCreationPlainFormGroup.controls.name.value,
      this.envCreationPlainFormGroup.controls.description.value,
      this.selectedTemplate.id,
      this.selectedLabels,
      this.selectedTemplate.base_config.maximum_lifetime,
      {
        ide: this.envCreationPlainFormGroup.controls.ide.value,
        downloadMethod: this.envCreationPlainFormGroup.controls.downloadMethod.value,
        environment_vars: this.envCreationPlainFormGroup.controls.source.value,
        auto_execution: this.envCreationPlainFormGroup.controls.isAutoExecution.value,
      },
      this.envCreationPlainFormGroup.controls.publish.value || false,
    ).subscribe((env) => {
      console.log('created example Environment ' + env.id);
      this.closeForm();
      this.fetchEnvironments(); // ---- Need?
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
        ide: this.wizardOptionFormGroup.controls.ide.value,
        downloadMethod: this.wizardOptionFormGroup.controls.downloadMethod.value,
        environment_vars: this.wizardOptionFormGroup.controls.source.value,
        auto_execution: this.wizardOptionFormGroup.controls.isAutoExecution.value,
      },
      isPublic || false,
    ).subscribe((env) => {
      console.log('created example Environment ' + env.id);
      this.closeForm();
      this.fetchEnvironments(); // ---- Need?
    });
  }

  onChangeDownloadMethod(val: string) {
    this.selectedDownloadMethod = val;
  }

  onChangeIde(val: string) {
    this.selectedIde = val;
  }
}
