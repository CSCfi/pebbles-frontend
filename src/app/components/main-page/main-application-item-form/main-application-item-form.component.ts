import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { CustomImageService } from "src/app/services/custom-image.service";
import { PublicConfigService } from "src/app/services/public-config.service";
import { Application, AttributeLimit } from 'src/app/models/application';
import { ApplicationTemplate, ApplicationType, ImageSourceType } from 'src/app/models/application-template';
import { BuildState, CustomImage } from "src/app/models/custom-image";

// --- For table
export interface ApplicationTemplateRow {
  name: string;
  description: string;
  is_enabled: boolean;
  labels: string[];
  lifetime: string;
  memory_gib: string;
}

// Backend uses pattern ^([\w\-_]+[.:])+([\w\-_]+)(/[\w\-_]+)*(/[\w\-_@]+:[\w\-_.]+)$
// defined in pebbles.utils.validate_container_image_url()
const IMAGE_URL_VALIDATION_RE = new RegExp(/^([\w\-_]+[.:])+([\w\-_]+)(\/[\w\-_]+)*(\/[\w\-_@]+:[\w\-_.]+)$/);

@Component({
  selector: 'app-main-application-item-form',
  templateUrl: './main-application-item-form.component.html',
  styleUrls: ['./main-application-item-form.component.scss']
})
export class MainApplicationItemFormComponent implements OnInit {

  applicationItemEditFormGroup: UntypedFormGroup;

  isAlwaysPullImage: boolean;
  sessionLifetimeHours: number;
  sessionMemoryGiB: number;
  sessionMemoryMaxGiB: number;

  customImageList: any[];

  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedDownloadMethod: string = null;
  selectedApplicationTemplateImage: string = null;
  selectedApplicationEnvironmentVars: string = null;
  applicationTemplateColumns: string[] = ['info'];
  applicationTemplateDataSource: MatTableDataSource<ApplicationTemplateRow> = null;
  isCheckedUserWorkFolder = true;

  // --- Discuss later do we need those variables
  // editButtonClicked: boolean;
  // createButtonClicked: boolean;

  availableLifetimeOptions: any[];
  availableMemoryOptions: any[];
  private prefix = 'image-registry.apps.2.rahti.csc.fi/noppe-public-images/';

  get isCreationMode(): boolean {
    return !this.data.application;
  }

  get customImage(): CustomImage {
    const ci = this.customImages.find(
        ci => ci.url === this.data.application.config.image_url);
    return ci ? ci : null;
  }

  get applicationTemplate(): ApplicationTemplate {
    const tmpl = this.applicationTemplates.find(
        tmpl => tmpl.base_config.image === this.data.application.config.image_url);
    return tmpl ? tmpl : null;
  }

  get imageSourceOption(): ImageSourceType {

    if (this.data.application.config.image_url.indexOf(this.prefix) && this.customImage){
      return ImageSourceType.Customized;
    }

    if (this.data.application.config.image_url && this.applicationTemplate){
      return ImageSourceType.Template;
    }

    return ImageSourceType.Original;
  }

  get customImages(): CustomImage[] {
    const cis = this.customImageService.getCustomImagesByWorkspaceId(this.data.workspaceId).sort(
        (a,b) => Number(b.started_at) - Number(a.started_at));

    const completedCis = cis.filter(x => x.state === BuildState.Completed);
    return completedCis ? Object.assign([], completedCis).reverse() : [];
  }

  get applicationTemplates(): ApplicationTemplate[] {
    const templates = this.applicationTemplateService.getApplicationTemplates();
    if (this.isCreationMode) {
      return templates.filter(
          tmpl =>
              tmpl.application_type === this.applicationItemEditFormGroup.controls.applicationType.value);
    } else {
      return templates.filter(
          tmpl =>
              tmpl.application_type === this.data.application.application_type);
    }
  }

  get selectedApplicationTemplate(): ApplicationTemplate {
    const selectedTemplate = this.applicationTemplateService.getApplicationTemplates().find(
        x => x.id === this.applicationItemEditFormGroup.controls.applicationTemplateId.value);
    if (selectedTemplate == undefined) {
      return null;
    } else {
      return selectedTemplate;
    }
  }

  get imageUrl(): string {
    let url = '';
    switch (this.applicationItemEditFormGroup.controls.imageSourceOption.value) {
      case ImageSourceType.Template:
        const tmpl = this.applicationTemplates.find(
            x => x.id === this.applicationItemEditFormGroup.controls.applicationTemplateId.value);
        url = tmpl.base_config.image_url;
        break;
      case ImageSourceType.Customized:
        url = this.applicationItemEditFormGroup.controls.customImageUrl.value;
        break;
    }
    return url ? url :  this.applicationItemEditFormGroup.controls.imageUrl.value.trim();
  }
  constructor(
      private router: Router,
      public dialogRef: MatDialogRef<MainApplicationItemFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {
        application: Application,
        workspaceId: string,
        isWorkspacePublic: boolean
      },
      public authService: AuthService,
      private formBuilder: UntypedFormBuilder,
      private applicationService: ApplicationService,
      private customImageService: CustomImageService,
      private applicationTemplateService: ApplicationTemplateService,
      private workspaceService: WorkspaceService,
      private publicConfigService: PublicConfigService
  ) {
    // TODO: Needed in case application is not available (e.g test case)
    // if (this.data.application) {
    //   this.selectedLabels = this.data.application.labels;
    // }
    this.selectedLabels = [];
  }

  get isCustomImageVisible(): boolean {
    return this.publicConfigService.isFeatureEnabled('customImages');
  }

  ngOnInit(): void {
    // this.editButtonClicked = this.createButtonClicked = false;

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
      imageSourceOption: ['', [Validators.required]],
      applicationType: ['', [Validators.required]],
      customImageList: [''],
      preBuiltImage: [''],
      customImageUrl: [''],
      downloadMethod: [''],
      source: [''],
      isEnableSharedFolder: [''],
      isEnableUserWorkFolder: [''],
      labels: [''],
      publish: ['', [Validators.required]],
      imageUrl: [
        '',
        [Validators.pattern(IMAGE_URL_VALIDATION_RE)]
      ],
      isAlwaysPullImage: [''],
      sessionLifetimeHours: [''],
      sessionMemoryGiB: [''],
      environmentVars: '',
    });

    // ---- Set default value
    this.applicationItemEditFormGroup.controls.imageSourceOption.setValue('template');
    this.applicationItemEditFormGroup.controls.applicationType.setValue(ApplicationType.Jupyter);
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationItemEditFormGroup.controls.customImageUrl.setValue(false);
    this.applicationItemEditFormGroup.controls.downloadMethod.setValue('none');
    this.applicationItemEditFormGroup.controls.isAlwaysPullImage.setValue(false);
    this.applicationItemEditFormGroup.controls.isEnableSharedFolder.setValue(!this.data.isWorkspacePublic);
    this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.setValue(!this.data.isWorkspacePublic);
    this.applicationItemEditFormGroup.controls.publish.setValue(false);
    this.applicationItemEditFormGroup.controls.sessionLifetimeHours.setValue(4);
    this.applicationItemEditFormGroup.controls.sessionMemoryGiB.setValue(1);
    // this.applicationItemEditFormGroup.controls.applicationTemplateId.setValue(this.applicationTemplates[0].id);
    this.onApplicationTypeChange();

    // public workspaces cannot have persistent folders ATM
    if (this.data.isWorkspacePublic) {
      this.applicationItemEditFormGroup.controls.isEnableSharedFolder.disable();
      this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.disable();
    }
    // activate validation reporting on imageUrl for immediate feedback
    this.applicationItemEditFormGroup.controls.imageUrl.markAsTouched();

    if (this.customImages.length === 0) {
      this.applicationItemEditFormGroup.controls.customImageUrl.disable();
    }
  }

  setEditForm(): void {
    this.selectedDownloadMethod = this.data.application.config.download_method;
    this.isAlwaysPullImage = coerceBooleanProperty(this.data.application.config.always_pull_image);

    // if custom image is not set, populate config.image_url with info.base_config_image
    if (!this.data.application.config.image_url) {
      this.data.application.config.image_url = this.data.application.info.base_config_image;
    }

    // take maximum lifetime from config if there, fall back to application field that always has a default value
    if (this.data.application.config.maximum_lifetime) {
      this.sessionLifetimeHours = Math.floor(this.data.application.config.maximum_lifetime / 3600);
    } else {
      this.sessionLifetimeHours = Math.floor(this.data.application.maximum_lifetime / 3600);
    }

    // take memory from config if exists, otherwise from info (populated from base config in the backend)
    if (this.data.application.config.memory_gib) {
      this.sessionMemoryGiB = this.data.application.config.memory_gib;
    } else {
      this.sessionMemoryGiB = this.data.application.info.memory_gib;
    }

    // environment vars
    if (this.data.application.config.environment_vars) {
      this.selectedApplicationEnvironmentVars = this.data.application.config.environment_vars;
    }

    this.applicationItemEditFormGroup = this.formBuilder.group({
      applicationTemplateId: [
        {
          value: this.data.application.template_id,
          disabled: false
        }],
      name: [this.data.application.name, [Validators.required, Validators.maxLength(128)]],
      description: [this.data.application.description, [Validators.required]],
      imageSourceOption: [this.imageSourceOption],
      customImageUrl: [this.data.application.config.image_url],
      downloadMethod: [this.selectedDownloadMethod],
      source: [this.data.application.config.download_url],
      imageUrl: ['', [Validators.pattern(IMAGE_URL_VALIDATION_RE)]],
      isAlwaysPullImage: [this.isAlwaysPullImage],
      isEnableSharedFolder: [this.applicationService.isSharedFolderEnabled(this.data.application, this.data.isWorkspacePublic)],
      isEnableUserWorkFolder: [coerceBooleanProperty(this.data.application.config.enable_user_work_folder)],
      labels: [''],
      publish: [this.data.application.is_enabled, [Validators.required]],
      sessionLifetimeHours: [this.sessionLifetimeHours],
      sessionMemoryGiB: [this.sessionMemoryGiB],
      environmentVars: [this.selectedApplicationEnvironmentVars],
    });

    switch (this.imageSourceOption) {
      case ImageSourceType.Template:
        this.onChangeApplicationTemplate(this.data.application.template_id);
        break;
      case ImageSourceType.Customized:
        this.setCustomImageList(ImageSourceType.Customized);
        this.onChangeCustomImage(this.customImage.url);
        break;
      default:
        this.applicationItemEditFormGroup.controls.imageUrl.setValue(this.data.application.config.image_url);
        break;
    }

    // public workspaces cannot have persistent folders ATM
    if (this.data.isWorkspacePublic) {
      this.applicationItemEditFormGroup.controls.isEnableSharedFolder.disable();
      this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.disable();
    }

    this.selectedLabels = this.data.application.labels;
    this.availableMemoryOptions = this.getMemoryOptions();

    // activate validation reporting on imageUrl for immediate feedback
    this.applicationItemEditFormGroup.controls.imageUrl.markAsTouched();
  }

  createApplicationByPlainMode(isPublic: boolean): void {
    // this.createButtonClicked = true;
    this.applicationService.createApplication(
        this.data.workspaceId,
        this.applicationItemEditFormGroup.controls.name.value,
        this.applicationItemEditFormGroup.controls.description.value,
        this.selectedApplicationTemplate.id,
        this.selectedLabels,
        this.selectedApplicationTemplate.base_config.maximum_lifetime,
        {
          download_method: this.applicationItemEditFormGroup.controls.downloadMethod.value,
          download_url: this.applicationItemEditFormGroup.controls.source.value,
          enable_shared_folder: this.applicationItemEditFormGroup.controls.isEnableSharedFolder.value,
          enable_user_work_folder: this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value,
          image_url: this.imageUrl,
          always_pull_image: this.applicationItemEditFormGroup.controls.isAlwaysPullImage.value,
          maximum_lifetime: this.applicationItemEditFormGroup.controls.sessionLifetimeHours.value * 3600,
          memory_gib: this.applicationItemEditFormGroup.controls.sessionMemoryGiB.value,
          environment_vars: this.applicationItemEditFormGroup.controls.environmentVars.value.trim(),
        },
        isPublic || false,
    ).subscribe(_ => {
          this.dialogRef.close();
        },
        error => {
          // this.createButtonClicked = false;
        }
    );
  }

  editApplicationItem(isPublic: boolean): void {
    // this.editButtonClicked = true;

    this.data.application.name = this.applicationItemEditFormGroup.controls.name.value;
    this.data.application.description = this.applicationItemEditFormGroup.controls.description.value;
    this.data.application.config.image_url = this.imageUrl;
    this.data.application.config.download_method = this.applicationItemEditFormGroup.controls.downloadMethod.value;
    this.data.application.config.download_url = this.applicationItemEditFormGroup.controls.source.value;
    this.data.application.config.enable_shared_folder = this.applicationItemEditFormGroup.controls.isEnableSharedFolder.value;
    this.data.application.config.enable_user_work_folder = this.applicationItemEditFormGroup.controls.isEnableUserWorkFolder.value;
    this.data.application.config.always_pull_image = this.applicationItemEditFormGroup.controls.isAlwaysPullImage.value;
    this.data.application.labels = this.selectedLabels;
    this.data.application.is_enabled = isPublic || this.applicationItemEditFormGroup.controls.publish.value;
    this.data.application.config.maximum_lifetime = this.applicationItemEditFormGroup.controls.sessionLifetimeHours.value * 3600;
    this.data.application.config.memory_gib = this.applicationItemEditFormGroup.controls.sessionMemoryGiB.value;
    if (this.applicationItemEditFormGroup.controls.environmentVars.value) {
      this.data.application.config.environment_vars = this.applicationItemEditFormGroup.controls.environmentVars.value.trim();
    }
    else {
      this.data.application.config.environment_vars = "";
    }
    this.applicationService.updateApplication(
        this.data.application
    ).subscribe(_ => {
          this.dialogRef.close();
        },
        error => {
          // this.editButtonClicked = false;
        }
    );
  }

  onChangeApplicationTemplate(id: string): void {
    const tmpl = this.applicationTemplates.find(x => x.id === id);
    // take the default label values from the template
    if (tmpl.base_config.labels) {
      this.selectedLabels = tmpl.base_config.labels.slice();
    }
    this.selectedApplicationTemplateImage = tmpl.base_config.image;
    this.applicationTemplateDataSource = this.composeApplicationTemplateDataSource(this.selectedApplicationTemplate);
  }

  composeApplicationTemplateDataSource(tmpl: ApplicationTemplate): MatTableDataSource<ApplicationTemplateRow> {
    return new MatTableDataSource(
        [
          {
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

  onChangeCustomImage(value: string): void {
    this.applicationItemEditFormGroup.controls.customImageUrl.setValue(value);
  }

  onChangeDownloadMethod(val: string): void {
    this.selectedDownloadMethod = val;
  }

  onChangeUserWorkFolder(val: boolean): void {
    this.isCheckedUserWorkFolder = val;
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
    this.sessionMemoryMaxGiB = this.data.application?.attribute_limits.find((obj: AttributeLimit) =>
        obj.name == "memory_gib"
    ).max;
    if (!this.sessionMemoryMaxGiB) {
      this.sessionMemoryMaxGiB = 8;
    }
    // start with the standard options, filter out those that are larger than the maximum allowed memory,
    // and add the currently set memory if not present
    let allMemoryOptions =
        [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256];
    let memoryOptions = allMemoryOptions.filter((option) => option <= this.sessionMemoryMaxGiB);
    if (this.sessionMemoryGiB && !memoryOptions.includes(this.sessionMemoryGiB)) {
      memoryOptions.push(this.sessionMemoryGiB);
    }
    if (!memoryOptions.includes(this.sessionMemoryMaxGiB)) {
      memoryOptions.push(this.sessionMemoryMaxGiB);
    }
    memoryOptions.sort((n1, n2) => n1 - n2);
    let res = [];
    for (let memOption of memoryOptions) {
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

  onChangeImageSource(value: ImageSourceType): void {
    if (value === ImageSourceType.Customized) {
      this.setCustomImageList(value);
    }
  }

  setCustomImageList(value: ImageSourceType): void {
    if (value === ImageSourceType.Customized) {
      const cis = this.customImageService.getCustomImagesByWorkspaceId(this.data.workspaceId);
      const customImages = cis.filter(x => x.state === BuildState.Completed)
          .sort((a, b) => Number(a.started_at) - Number(b.started_at));

      this.customImageList = [];
      for (let ci of customImages) {
        this.customImageList.push(
            {
              value: ci.url,
              viewValue: ci.name,
            }
        );
      }
    }
  }

  onApplicationTypeChange() {
    if (this.applicationTemplates!.length > 0) {
      this.applicationItemEditFormGroup.controls.applicationTemplateId.setValue(this.applicationTemplates[0].id);
      this.onChangeApplicationTemplate(this.applicationTemplates[0].id);
    }
  }

  protected readonly ImageSourceType = ImageSourceType;

  onCustomImageTab() {
    this.dialogRef.close();
    const url = this.router.serializeUrl(
      this.router.createUrlTree(
          ['/main/workspace-owner'], { queryParams: { id: this.data.workspaceId, tab: 2 },})
    );
    window.open(url, '_self');
  }
}
