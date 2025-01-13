import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomImageService } from "../../../services/custom-image.service";
import { CustomImage, BuildState } from "../../../models/custom-image";
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
  styleUrls: ['./main-workspace-custom-images.component.scss'],
})
export class MainWorkspaceCustomImagesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() workspaceId: string = null;
  @Input() isWorkspaceExpired = false;

  baseImages: string[];
  protected readonly BuildState = BuildState;

  public displayedColumns: string[] = ['name','meta','action'];
  public customImageList: CustomImageRow[] =[];
  public customImageDataSource: CustomImageRow[] = [];

  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  isQuotaLeft() {
    return this.getCustomImages().length < 10 || this.authService.isAdmin;
  }

  isLogVisible: boolean = false;
  toggleLog() {
    this.isLogVisible = !this.isLogVisible;
  }

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

    this.customImageService.fetchCustomImages().subscribe( ()=> {
      this.applicationTemplateService.fetchApplicationTemplates().subscribe(() => {
          this.baseImages = Array.from(
            this.applicationTemplateService.getApplicationTemplates(), (x) => x.base_config.image
          );
          this.rebuildDataSource();
        }
      )
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
      (a,b) => Number(b.started_at) - Number(a.started_at))
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
      }
    }).afterClosed().subscribe(customImage => {
      if (customImage.name) {
        return this.customImageService.createCustomImage(
          customImage.name, this.workspaceId, customImage.definition
        ).subscribe();
      }
    });
  }

  deleteCustomImage(id: string) {
    if (!confirm(`Are you sure you want to delete custom image "${this.customImageService.get(id).name}"?`)) {
      return;
    }
    this.customImageService.deleteCustomImage(id).subscribe();
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
    if(!cis) return [];

    const rows = [];
    cis.forEach(image => {
      rows.push({
        id: image.id,
        name: image.name,
        tag: image.tag ? image.tag : null,
        state: image.to_be_deleted ? BuildState.Deleting : image.state ? image.state : '-',
        url: image.url ? image.url : '-',
        dockerfile: image.dockerfile,
        log: image.build_system_output
      })
    })

    rows.map((row, index) => {
      row.index = index + 1;
    });

    return rows;
  }
}
