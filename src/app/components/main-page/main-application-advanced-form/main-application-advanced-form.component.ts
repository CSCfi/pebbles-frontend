import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationTemplateService } from 'src/app/services/application-template.service';
import { ApplicationService } from 'src/app/services/application.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { CustomImageService } from "src/app/services/custom-image.service";
import { PublicConfigService } from "src/app/services/public-config.service";
import { Application, AttributeLimit } from 'src/app/models/application';
import { ApplicationTemplate, ApplicationType, ImageSourceType } from 'src/app/models/application-template';
import { BuildState, CustomImage } from "src/app/models/custom-image";
import { EventService } from "../../../services/event.service";
import { HttpErrorResponse } from "@angular/common/http";

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
  selector: 'app-main-application-advanced-form',
  templateUrl: './main-application-advanced-form.component.html',
  styleUrl: './main-application-advanced-form.component.scss'
})
export class MainApplicationAdvancedFormComponent implements OnInit {

  @Input() applicationId: string | null = null;
  @Input() workspaceId: string;

  @ViewChild('firstFocus') firstFocus!: ElementRef<HTMLInputElement>;

  application: Application;

  //---- Form
  applicationItemEditFormGroup: FormGroup;
  // sessionMemoryGiB: number;
  // sessionMemoryMaxGiB: number;
  customImageList: any[];
  // ---- Values for Radio Input
  selectedLabels: string[];
  selectedDownloadMethod: string = null;

  applicationTemplateColumns: string[] = ['info'];
  applicationTemplateDataSource: MatTableDataSource<ApplicationTemplateRow> = null;

  // isCheckedUserWorkFolder = true;
  editButtonClicked: boolean;
  createButtonClicked: boolean;

  availableLifetimeOptions: any[];
  availableMemoryOptions: any[];

  private prefix = 'image-registry.apps.2.rahti.csc.fi/noppe-public-images/';
  protected readonly ImageSourceType = ImageSourceType;

  get isWorkspacePublic(): boolean {
    return this.workspaceService.isWorkspacePublic(this.workspaceId);
  };

  get isCreationMode(): boolean {
    return !this.application;
  }

  get customImage(): CustomImage {
    const ci = this.customImages.find(
      ci => ci.url === this.application.config.image_url);
    return ci ? ci : null;
  }

  get applicationTemplate(): ApplicationTemplate {
    const tmpl = this.applicationTemplates.find(
      tmpl => tmpl.base_config.image === this.application.config.image_url);
    return tmpl ? tmpl : null;
  }

  get imageSourceOption(): ImageSourceType {

    if (this.application.config.image_url.indexOf(this.prefix) && this.customImage) {
      return ImageSourceType.Customized;
    }

    if (this.application.config.image_url && this.applicationTemplate) {
      return ImageSourceType.Template;
    }

    return ImageSourceType.Original;
  }

  get customImages(): CustomImage[] {
    const cis = this.customImageService.getCustomImagesByWorkspaceId(this.workspaceId).sort(
      (a, b) => Number(b.started_at) - Number(a.started_at));

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
          tmpl.application_type === this.application.application_type);
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
    const form = this.applicationItemEditFormGroup.controls;
    switch (form.imageSourceOption.value) {
      case ImageSourceType.Template:
        const tmpl = this.applicationTemplates.find(
          x => x.id === form.applicationTemplateId.value);
        url = tmpl.base_config.image_url;
        break;
      case ImageSourceType.Customized:
        url = form.customImageUrl.value;
        break;
    }
    return url ? url : form.imageUrl.value.trim();
  }

  get isCustomImageVisible(): boolean {
    return this.publicConfigService.isFeatureEnabled('customImages') &&
      (this.applicationItemEditFormGroup.controls.applicationType?.value === ApplicationType.Jupyter ||
        this.application?.application_type === ApplicationType.Jupyter);
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private customImageService: CustomImageService,
    private applicationTemplateService: ApplicationTemplateService,
    private workspaceService: WorkspaceService,
    private publicConfigService: PublicConfigService,
    private eventService: EventService,
  ) {
    // TODO: Needed in case application is not available (e.g test case)
    // if (this.application) {
    //   this.selectedLabels = this.application.labels;
    // }
  }

  ngOnInit(): void {
    this.editButtonClicked = this.createButtonClicked = false;
    this.rebuildForm();

    if (this.applicationId) {
      if (this.applicationId === 'new') {
        this.setCreationForm();
      } else {
        this.application = this.applicationService.getApplicationById(this.applicationId);
        if (this.application) {
          this.setEditForm(this.application);
        } else {
          this.applicationService.fetchApplications().subscribe(() => {
            this.application = this.applicationService.getApplicationById(this.applicationId);
            if (this.application) {
              this.setEditForm(this.application);
            } else {
              alert('FAIL: Application not found');
              this.closeAdvancedForm(false);
            }
          })
        }
      }
    } else {
      this.closeAdvancedForm(false);
    }
  }

  rebuildForm(): void {
    this.selectedLabels = [];
    this.availableLifetimeOptions = this.getLifetimeOptions();
    this.availableMemoryOptions = this.getMemoryOptions();

    this.applicationItemEditFormGroup = this.formBuilder.group({
      // ---- Application information
      name: ['', [Validators.required, Validators.maxLength(128)]],
      description: ['', [Validators.required]],
      // ---- Image information
      applicationType: ['', [Validators.required]],
      imageSourceOption: ['', [Validators.required]],
      applicationTemplateId: ['', [Validators.required]],
      customImageUrl: [''],
      customImageList: [''],
      imageUrl: ['', [Validators.pattern(IMAGE_URL_VALIDATION_RE)]],
      isAlwaysPullImage: [''],
      // ---- Session information
      sessionLifetimeHours: [''],
      sessionMemoryGiB: [''],
      downloadMethod: ['', [Validators.required]],
      downloadSourceUrl: [''],
      isEnableSharedFolder: [''],
      isEnableUserWorkFolder: [''],
      environmentVars: '',
      publish: ['', [Validators.required]],
    });
  }

  setCreationForm(): void {
    const formControls = this.applicationItemEditFormGroup.controls;

    // ---- Image information
    formControls.applicationType.setValue(ApplicationType.Jupyter);
    formControls.imageSourceOption.setValue('template');
    formControls.isAlwaysPullImage.setValue(false);
    this.onApplicationTypeChange();
    if (this.customImages.length === 0) {
      formControls.customImageUrl.disable();
    }

    // ---- Session information
    formControls.sessionLifetimeHours.setValue(4);
    formControls.sessionMemoryGiB.setValue(1);
    formControls.downloadMethod.setValue('none');
    formControls.isEnableSharedFolder.setValue(!this.isWorkspacePublic);
    formControls.isEnableUserWorkFolder.setValue(!this.isWorkspacePublic);
    formControls.publish.setValue(false);

    // public workspaces cannot have persistent folders ATM
    if (this.isWorkspacePublic) {
      formControls.isEnableSharedFolder.disable();
      formControls.isEnableUserWorkFolder.disable();
    }

    // activate validation reporting on imageUrl and download source for immediate feedback
    formControls.imageUrl.markAsTouched();
    formControls.downloadSourceUrl.markAsTouched();
  }

  setEditForm(application: Application): void {
    const formControls = this.applicationItemEditFormGroup.controls;
    const appConfig = this.application.config;

    // ---- Application information
    formControls.name.setValue(application.name);
    formControls.description.setValue(application.description);

    // ---- Image information
    formControls.applicationType.setValue(application.application_type);
    formControls.applicationTemplateId.setValue({
      value: this.application.template_id,
      disabled: false
    });
    // if custom image is not set, populate config.image_url with info.base_config_image
    appConfig.image_url = appConfig.image_url || this.application.info.base_config_image;
    formControls.imageSourceOption.setValue(this.imageSourceOption);
    switch (this.imageSourceOption) {
      case ImageSourceType.Template:
        this.onChangeApplicationTemplate(this.application.template_id);
        break;
      case ImageSourceType.Customized:
        this.setCustomImageList(ImageSourceType.Customized);
        this.onChangeCustomImage(this.customImage.url);
        formControls.customImageUrl.setValue(appConfig.image_url);
        break;
      default:
        // activate validation reporting on imageUrl and download source for immediate feedback
        formControls.imageUrl.setValue(appConfig.image_url);
        // ---- Activate validation intimidatory
        formControls.imageUrl.markAsTouched();
        break;
    }
    formControls.isAlwaysPullImage.setValue(coerceBooleanProperty(appConfig.always_pull_image));
    this.selectedLabels = this.application.labels;

    // ---- Session Information
    // take maximum lifetime from config if there, fall back to application field that always has a default value
    let lifetime = appConfig.maximum_lifetime || this.application.maximum_lifetime;
    formControls.sessionLifetimeHours.setValue(Math.floor(lifetime / 3600));

    // take memory from config if exists, otherwise from info (populated from base config in the backend)
    formControls.sessionMemoryGiB.setValue(appConfig.memory_gib || this.application.info.memory_gib);

    this.selectedDownloadMethod = appConfig.download_method;
    formControls.downloadMethod.setValue(appConfig.download_method);

    formControls.downloadSourceUrl.setValue(appConfig.download_url);
    formControls.downloadSourceUrl.markAsTouched();

    // public workspaces cannot have persistent folders ATM
    if (this.isWorkspacePublic) {
      formControls.isEnableSharedFolder.disable();
      formControls.isEnableUserWorkFolder.disable();
    } else {
      formControls.isEnableSharedFolder.setValue(
        this.applicationService.isSharedFolderEnabled(this.application, this.isWorkspacePublic));
      formControls.isEnableUserWorkFolder.setValue(
        coerceBooleanProperty(appConfig.enable_user_work_folder));
    }
    formControls.environmentVars.setValue(appConfig.environment_vars);
    formControls.publish.setValue(this.application.is_enabled);
  }

  focusFirstInput() {
    // requestAnimationFrame(() => {
    this.firstFocus?.nativeElement?.focus();
    // });
  }

  createApplicationByPlainMode(isPublic: boolean): void {
    this.createButtonClicked = true;
    const formControls = this.applicationItemEditFormGroup.controls;

    this.applicationService.createApplication(
      this.workspaceId,
      formControls.name.value,
      formControls.description.value,
      this.selectedApplicationTemplate.id,
      this.selectedLabels,
      this.selectedApplicationTemplate.base_config.maximum_lifetime,
      {
        download_method: formControls.downloadMethod.value,
        download_url: formControls.downloadSourceUrl.value,
        enable_shared_folder: formControls.isEnableSharedFolder.value,
        enable_user_work_folder: formControls.isEnableUserWorkFolder.value,
        image_url: this.imageUrl,
        always_pull_image: formControls.isAlwaysPullImage.value,
        maximum_lifetime: formControls.sessionLifetimeHours.value * 3600,
        memory_gib: formControls.sessionMemoryGiB.value,
        environment_vars: formControls.environmentVars.value.trim(),
      },
      isPublic || false,
    ).subscribe({
      next: () => {
        this.createButtonClicked = false;
        this.closeAdvancedForm(true);
      },
      error: (err: HttpErrorResponse) => {
        this.createButtonClicked = false;
        if (err.status === 422) {
          console.error('Validation error (422):', err.error);
          alert('There is an issue with the input. Please check the console for details.');
        } else {
          console.error('Unexpected error:', err);
          alert('An error occurred while creating the application.');
        }
      }
    });
  }

  editApplicationItem(isPublic: boolean): void {
    this.editButtonClicked = true;
    const formControls = this.applicationItemEditFormGroup.controls;

    this.application.name = formControls.name.value;
    this.application.description = formControls.description.value;
    this.application.config.image_url = this.imageUrl;
    this.application.config.download_method = formControls.downloadMethod.value;
    this.application.config.download_url = formControls.downloadSourceUrl.value;
    this.application.config.enable_shared_folder = formControls.isEnableSharedFolder.value;
    this.application.config.enable_user_work_folder = formControls.isEnableUserWorkFolder.value;
    this.application.config.always_pull_image = formControls.isAlwaysPullImage.value;
    this.application.labels = this.selectedLabels;
    this.application.is_enabled = isPublic;
    this.application.config.maximum_lifetime = formControls.sessionLifetimeHours.value * 3600;
    this.application.config.memory_gib = formControls.sessionMemoryGiB.value;
    this.application.config.environment_vars = formControls.environmentVars.value?.trim() || "";

    this.applicationService.updateApplication(
      this.application
    ).subscribe({
      next: (response) => {
        console.log('Application updated successfully:', response);
        this.createButtonClicked = false;
        this.closeAdvancedForm(false);
      },
      error: (err: HttpErrorResponse) => {
        this.createButtonClicked = false;
        if (err.status === 422) {
          console.error('Validation error (422):', err.error);
          alert('There is an issue with the input. Please check the console for details.');
        } else {
          console.error('Unexpected error:', err);
          alert('An error occurred while creating the application.');
        }
      }
    });
  }

  onChangeApplicationTemplate(id: string): void {
    const tmpl = this.applicationTemplates.find(x => x.id === id);
    // take the default label values from the template
    if (tmpl.base_config.labels) {
      this.selectedLabels = tmpl.base_config.labels.slice();
    }
    this.applicationItemEditFormGroup.controls.imageUrl.setValue(tmpl.base_config.image);
    this.applicationItemEditFormGroup.controls.applicationTemplateId.setValue(id);
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
    const formControls = this.applicationItemEditFormGroup.controls;

    formControls.downloadSourceUrl.clearValidators();
    formControls.downloadSourceUrl.updateValueAndValidity();

    if (val !== 'none') {
      formControls.downloadSourceUrl.setValidators([Validators.required]);
      formControls.downloadSourceUrl.updateValueAndValidity();
      formControls.downloadSourceUrl.markAsTouched();
    }

    this.selectedDownloadMethod = val;
    formControls.downloadMethod.setValue(val);
  }

  // onChangeUserWorkFolder(val: boolean): void {
  //   this.isCheckedUserWorkFolder = val;
  // }

  getLifetimeOptions(): any[] {
    let res = [];
    for (let lifetimeOption of [1, 2, 4, 8, 12]) {
      res.push({value: lifetimeOption, viewValue: lifetimeOption + " h"})
    }
    return res;
  }

  getMemoryOptions(): any[] {
    // get the workspace session memory limit to calculate the number of parallel sessions per option
    const workspaceMemGiB = this.workspaceService.getWorkspaceById(this.workspaceId)?.memory_limit_gib;
    let sessionMemoryMaxGiB = this.application?.attribute_limits.find((obj: AttributeLimit) =>
      obj.name == "memory_gib"
    ).max;
    if (!sessionMemoryMaxGiB) {
      sessionMemoryMaxGiB = 8;
    }
    // start with the standard options, filter out those that are larger than the maximum allowed memory,
    // and add the currently set memory if not present
    let allMemoryOptions =
      [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256];
    let memoryOptions = allMemoryOptions.filter((option) => option <= sessionMemoryMaxGiB);
    // ---- Do we need this below?
    // if (this.sessionMemoryGiB && !memoryOptions.includes(this.sessionMemoryGiB)) {
    //   memoryOptions.push(this.sessionMemoryGiB);
    // }
    if (!memoryOptions.includes(sessionMemoryMaxGiB)) {
      memoryOptions.push(sessionMemoryMaxGiB);
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
    const formControls = this.applicationItemEditFormGroup.controls;

    formControls.applicationTemplateId.clearValidators();
    formControls.customImageUrl.clearValidators();
    formControls.imageUrl.clearValidators();

    formControls.applicationTemplateId.updateValueAndValidity();
    formControls.customImageUrl.updateValueAndValidity();
    formControls.imageUrl.updateValueAndValidity();


    if (value === ImageSourceType.Template) {
      formControls.applicationTemplateId.setValidators([Validators.required])
      formControls.applicationTemplateId.updateValueAndValidity();
    } else if (value === ImageSourceType.Customized) {
      this.setCustomImageList(value);
      formControls.customImageUrl.setValidators([Validators.required]);
      formControls.customImageUrl.updateValueAndValidity();
    } else if (value === ImageSourceType.Original) {
      formControls.imageUrl.setValidators([Validators.required]);
      formControls.imageUrl.updateValueAndValidity();
    }
  }

  setCustomImageList(value: ImageSourceType): void {
    if (value === ImageSourceType.Customized) {
      const cis = this.customImageService.getCustomImagesByWorkspaceId(this.workspaceId);
      const customImages = cis.filter(x => x.state === BuildState.Completed)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

      this.customImageList = [];
      for (let ci of customImages) {
        this.customImageList.push(
          {
            url: ci.url,
            name: `${ci.name}`,
            meta: `${this.getDaysAgo(ci.completed_at)}`,
          }
        );
      }
    }
  }

  onApplicationTypeChange() {
    if (this.applicationTemplates!.length > 0) {
      this.applicationItemEditFormGroup.controls.imageSourceOption.setValue(ImageSourceType.Template);
      this.applicationItemEditFormGroup.controls.applicationTemplateId.setValue(this.applicationTemplates[0].id);
      this.onChangeApplicationTemplate(this.applicationTemplates[0].id);
    }
  }

  getDaysAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      if (diffInMinutes === 1) {
        return `${diffInMinutes} minute ago`;
      }
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      if (diffInHours === 1) {
        return `${diffInHours} hour ago`;
      }
      return `${diffInHours} hours ago`;
    } else {
      if (diffInDays === 1) {
        return `${diffInDays} day ago`;
      }
      return `${diffInDays} days ago`;
    }
  }

  onHoverCustomImageHint() {
    this.eventService.uiEffect$.next(true);
  }

  awayHoverCustomImageHint() {
    this.eventService.uiEffect$.next(false);
  }

  closeAdvancedForm(onRefresh: boolean) {
    this.router.navigate([], {
        queryParams: {
          edit: null,
        },
        queryParamsHandling: 'merge'
      }
    ).then( ()=> {
      if (onRefresh) {
        window.location.reload();
        return;
      }
    });
  }
}
