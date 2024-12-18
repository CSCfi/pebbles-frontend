import { Component, Input, OnInit } from '@angular/core';
import { CustomImageService } from "../../../services/custom-image.service";
import { CustomImage } from "../../../models/custom-image";
import { MatDialog as MatDialog } from "@angular/material/dialog";
import { MainCustomImageFormComponent } from "../main-custom-image-form/main-custom-image-form.component";
import { ApplicationTemplateService } from "../../../services/application-template.service";

@Component({
  selector: 'app-main-workspace-custom-images',
  templateUrl: './main-workspace-custom-images.component.html',
  styleUrls: ['./main-workspace-custom-images.component.scss']
})
export class MainWorkspaceCustomImagesComponent implements OnInit {
  @Input() workspaceId: string = null;
  baseImages: string[];

  constructor(
    private customImageService: CustomImageService,
    private applicationTemplateService: ApplicationTemplateService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.customImageService.fetchCustomImages().subscribe( ()=> {
    this.applicationTemplateService.fetchApplicationTemplates().subscribe(() => {
        this.baseImages = Array.from(
          this.applicationTemplateService.getApplicationTemplates(), (x) => x.base_config.image
        );
      }
    )
    });
  }

  getCustomImages(): CustomImage[] {
    const cis = this.customImageService.getCustomImages();
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
}
