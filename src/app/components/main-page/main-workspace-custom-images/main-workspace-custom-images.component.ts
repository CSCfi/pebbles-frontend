import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomImageService } from "../../../services/custom-image.service";
import { BuildState, CustomImage } from "../../../models/custom-image";
import { MatDialog as MatDialog } from "@angular/material/dialog";
import { MainCustomImageFormComponent } from "../main-custom-image-form/main-custom-image-form.component";
import { ApplicationTemplateService } from "../../../services/application-template.service";
import { PublicConfigService } from "../../../services/public-config.service";
import { AuthService } from "../../../services/auth.service";
import { EventService } from "../../../services/event.service";

export interface CustomImageRow {
  index: number;
  name: string;
  tag: string;
  state: BuildState;
  url: string;
}

@Component({
  selector: 'app-main-workspace-custom-images',
  templateUrl: './main-workspace-custom-images.component.html',
  styleUrls: ['./main-workspace-custom-images.component.scss']
})
export class MainWorkspaceCustomImagesComponent implements OnInit, OnChanges, OnDestroy {
  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  @Input() workspaceId: string = null;
  @Input() isWorkspaceExpired = false;

  protected readonly BuildState = BuildState;
  public displayedColumns: string[] = ['name', 'meta', 'action'];
  public customImageList: CustomImageRow[] = [];
  public customImageDataSource: CustomImageRow[] = [];

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
    public publicConfigService: PublicConfigService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventService.customImageDataUpdate$.subscribe(_ => {
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

  ngOnChanges(changes: SimpleChanges): void {
    // selected workspace changed, clear old data and rebuild data source
    this.customImageDataSource = null;
    this.rebuildDataSource();
  }

  ngOnDestroy(): void {
    // unsubscribe from Subjects
    this.subscriptions.map(x => x.unsubscribe());
  }

  getCustomImages(): CustomImage[] {
    const cis = this.customImageService.getCustomImagesByWorkspaceId(this.workspaceId).sort(
      (a, b) => Number(b.started_at) - Number(a.started_at))
    return cis ? Object.assign([], cis).reverse() : [];
  }

  buildImage(previousVersion: CustomImage): void {
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
          customImage.name, this.workspaceId, customImage.definition
        ).subscribe(() => {
            this.rebuildDataSource();
          }
        );
      }
    });
  }

  deleteCustomImage(id: string) {
    if (!confirm(`Are you sure you want to delete custom image "${this.customImageService.get(id).name}"?`)) {
      return;
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
    const state = ci.state.substring(0, 1).toUpperCase() + ci.state.substring(1);
    return state;
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

  private rebuildDataSource() {
    const images = this.customImageService.getCustomImagesByWorkspaceId(this.workspaceId);
    if (!images) {
      return;
    }
    this.customImageList = this.composeDataSource(images);
    this.customImageDataSource = this.customImageList;
  }

  private composeDataSource(cis: CustomImage[]) {
    if (!cis) return [];

    const rows = [];
    cis.forEach(image => {
      rows.push({
        id: image.id,
        name: image.name,
        tag: image.tag ? image.tag : null,
        state: image.to_be_deleted ? BuildState.Deleting : image.state ? image.state : '-',
        url: image.url ? image.url : '-',
        dockerfile: image.dockerfile,
        log: image.build_system_output,
        definition: image.definition,
        started_at: image.started_at,
      })
    });
    // Sort in descending order by tag. New images without tag are first.
    rows.sort((a, b) => {
      if (a.tag === null) {
        return -1;
      }
      if (b.tag === null) {
        return 1;
      }
      if (a.tag === b.tag) {
        return 0;
      }
      return a.tag > b.tag ? -1 : 1;
    });
    rows.map((row, index) => {
      row.index = index + 1;
    });

    return rows;
  }
}
