import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog as MatDialog } from "@angular/material/dialog";
import { BuildState, CustomImage } from "src/app/models/custom-image";
import { Workspace } from "src/app/models/workspace";
import { CustomImageService } from "src/app/services/custom-image.service";
import { ApplicationTemplateService } from "src/app/services/application-template.service";
import { PublicConfigService } from "src/app/services/public-config.service";
import { AuthService } from "src/app/services/auth.service";
import { EventService } from "src/app/services/event.service";
import { MainCustomImageFormComponent } from "../main-custom-image-form/main-custom-image-form.component";
import { ApplicationService } from "../../../services/application.service";
import { Application } from "../../../models/application";


export interface CustomImageRow extends CustomImage {
  index: number;
  applicationReferences: Application[];
}

@Component({
  selector: 'app-main-workspace-custom-images',
  templateUrl: './main-workspace-custom-images.component.html',
  styleUrls: ['./main-workspace-custom-images.component.scss'],
  standalone: false
})
export class MainWorkspaceCustomImagesComponent implements OnInit, OnChanges, OnDestroy {
  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  @Input() workspace: Workspace;
  @Input() isWorkspaceExpired = false;

  protected readonly BuildState = BuildState;
  public displayedColumns: string[] = ['name', 'meta', 'action'];
  public dataSource: CustomImageRow[] = [];

  baseImages: string[];
  private prefix = 'image-registry.apps.2.rahti.csc.fi/noppe-public-images/';

  isQuotaLeft() {
    return this.getCustomImages().length < 10 || this.authService.isAdmin;
  }

  // store log visibility selection in a map outside the custom image data to make it easier to persist it
  // when custom images are fetched and data source regenerated
  private logVisibleMap = new Map<string, boolean>();

  constructor(
    public dialog: MatDialog,
    private customImageService: CustomImageService,
    private applicationTemplateService: ApplicationTemplateService,
    private eventService: EventService,
    private authService: AuthService,
    public publicConfigService: PublicConfigService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit(): void {
    // listen on changes of custom images
    this.subscriptions.push(
      this.eventService.customImageDataUpdate$.subscribe(_ => {
        this.rebuildDataSource();
      })
    );
    // listen on changes of applications, to keep the reference counts updated
    this.subscriptions.push(
      this.eventService.applicationDataUpdate$.subscribe(_ => {
        this.rebuildDataSource();
      })
    );

    this.customImageService.fetchCustomImages().subscribe(() => {
      this.applicationTemplateService.fetchApplicationTemplates().subscribe((ats) => {
        this.baseImages = [];
        ats.forEach(tmpl => {
          if (tmpl.application_type === 'jupyter' && tmpl.base_config.image.startsWith(this.prefix)) {
            if (!this.baseImages.includes(tmpl.base_config.image)) {
              this.baseImages.push(tmpl.base_config.image);
            }
          }
        });
      });
      this.rebuildDataSource();
    });
  }

  ngOnChanges(): void {
    // selected workspace changed, clear old data and rebuild data source
    this.dataSource = null;
    this.rebuildDataSource();
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  getCustomImages(): CustomImage[] {
    return this.customImageService.getCustomImagesByWorkspaceId(this.workspace.id);
  }

  getReferencingApplications(image: CustomImage): Application[] {
    return this.applicationService.getApplications().filter((x) => x.config.image_url === image.url);
  }

  extractApplicationNames(apps: Application[]): string[] {
      return apps ? apps.map(a => '"' + a.name + '"') : [];
  }

  buildImageDialog(previousVersion: CustomImage): void {
    this.dialog.open(MainCustomImageFormComponent, {
      height: 'auto',
      width: '1280px',
      autoFocus: false,
      data: {
        baseImages: this.baseImages,
        previousVersion,
        commonImagePrefix: this.prefix,
      }
    }).afterClosed().subscribe(customImage => {
      if (customImage.name) {
        return this.customImageService.createCustomImage(
          customImage.name, this.workspace.id, customImage.definition
        ).subscribe(() => {
            this.rebuildDataSource();
          }
        );
      }
    });
  }

  deleteCustomImage(id: string): void {
    const customImage = this.customImageService.get(id);
    const refAppNames = this.extractApplicationNames(this.getReferencingApplications(customImage));
    if (refAppNames.length > 0) {
      if (!confirm(`The following applications are still using this image and will stop working:`+
        `\n${refAppNames.join('\n')}`+
        `\n\n`+
        `Are you sure you want to delete custom image\n"${customImage.name}"?`)) {
        return;
      }
    }
    else {
      if (!confirm(`Are you sure you want to delete custom image\n"${customImage.name}"?`)) {
        return;
      }
    }
    this.customImageService.deleteCustomImage(id).subscribe(() => {
        this.rebuildDataSource();
      }
    );
  }

  toggleLog(id: string): void {
    this.logVisibleMap.set(id, !this.isLogVisible(id));
  }

  isLogVisible(id: string): boolean {
    return this.logVisibleMap.has(id) && this.logVisibleMap.get(id);
  }

  getHumanReadableStateString(ci: CustomImage): string {
    if (ci.state === BuildState.New) {
      return 'Queuing';
    }
    return ci.state.substring(0, 1).toUpperCase() + ci.state.substring(1);
  }

  getStateExplanation(ci: CustomImage): string {
    switch (ci.state) {
      case BuildState.New:
        return 'Waiting for the build system to pick this up';
      case BuildState.Building:
        const elapsedMinutes = Math.round((Date.now() - Date.parse(ci.started_at + 'Z')) / 1000 / 60);
        const minuteString = elapsedMinutes === 1 ?
          elapsedMinutes + ' minute ago' : elapsedMinutes + ' minutes ago';
        return 'This will take a while, please be patient. Build started ' + minuteString + '.';
    }
    return '';
  }

  private rebuildDataSource(): void {
    const images = this.customImageService.getCustomImagesByWorkspaceId(this.workspace.id);
    if (!images) {
      return;
    }
    this.dataSource = this.composeDataSource(images);
  }

  private composeDataSource(cis: CustomImage[]): CustomImageRow[] {
    if (!cis) return [];

    const rows: CustomImageRow[] = [];
    cis.forEach(image => {
      // count the number of applications that have a reference to this custom image
      const appRefs = this.getReferencingApplications(image);
      rows.push({...image, index: -1, applicationReferences: appRefs});
    });
    // Sort in descending order by created_at
    rows.sort((a, b) => {
      if (a.created_at === null) {
        return -1;
      }
      if (b.created_at === null) {
        return 1;
      }
      if (a.created_at === b.created_at) {
        return 0;
      }
      return a.created_at > b.created_at ? -1 : 1;
    });
    rows.map((row, index) => {
      row.index = index + 1;
    });
    return rows;
  }
}
