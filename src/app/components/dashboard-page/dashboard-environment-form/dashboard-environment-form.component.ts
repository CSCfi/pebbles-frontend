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
  isAutoExecution: boolean;
  downloadMethod: string;
  ide: string;
  selectedLabels: string[];
  selectedTemplate: EnvironmentTemplate;

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
    if (this.data.isPlainMode){
      console.log('----> plain mode');
      this.envCreationPlainFormGroup = this.formBuilder.group({
        templateId: ['', [Validators.required]],
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        categories: [''],
        ide: [''],
        downloadMethod: [''],
        source: [''],
        isAutoExecution: [''],
        publish: ['', [Validators.required]],
      });

      // ---- For debug
      // this.envCreationPlainFormGroup.controls.name.setValue('creation test from the plain form');
      // this.envCreationPlainFormGroup.controls.description.setValue('creation test from the plain form');
      // ---- Set default value
      this.envCreationPlainFormGroup.controls.publish.setValue(false);

    }else{

      this.isLinear = false;
      this.isAutoExecution = false;
      this.downloadMethod = 'none';
      this.ide = 'jupyter';
      this.wizardTemplateFormGroup = this.formBuilder.group({
        templateId: ['', [Validators.required]]
      });
      this.wizardProfileFormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        categories: ['']
      });
      this.wizardOptionFormGroup = this.formBuilder.group({
        ide: ['', [Validators.required]],
        downloadMethod: [''],
        source: [''],
      });
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  selectTemplate(event: Event) {
    this.selectedTemplate = this.environmentTemplates.find(x => x.id === (event.target as HTMLSelectElement).value);
  }

  fetchEnvironments(): void {
    this.environmentService.fetchEnvironments().subscribe(() => {
      console.log('environments fetched');
    });
  }

  createEnvironmentByPlainMode(): void {
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.envCreationPlainFormGroup.controls.name.value,
      this.envCreationPlainFormGroup.controls.templateId.value,
      {
        name: this.envCreationPlainFormGroup.controls.name.value,
        description: this.envCreationPlainFormGroup.controls.description.value,
        categories: ['basic', 'python'],
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
    this.environmentService.createEnvironment(
      this.data.workspaceId,
      this.wizardProfileFormGroup.controls.name.value,
      this.wizardTemplateFormGroup.controls.templateId.value,
      {
        name: this.wizardProfileFormGroup.controls.name.value,
        description: this.wizardProfileFormGroup.controls.description.value,
        categories: ['basic', 'python'],
        ide: this.wizardOptionFormGroup.controls.ide.value,
        downloadMethod: this.wizardOptionFormGroup.controls.downloadMethod.value,
        environment_vars: this.wizardOptionFormGroup.controls.source.value,
        auto_execution: false,
      },
      isPublic || false,
    ).subscribe((env) => {
      console.log('created example Environment ' + env.id);
      this.closeForm();
      this.fetchEnvironments(); // ---- Need?
    });
  }
}
