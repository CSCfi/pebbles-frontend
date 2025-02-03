import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuildState } from "../../../models/custom-image";
import { CustomImageService } from "../../../services/custom-image.service";

@Component({
  selector: 'app-main-select-custom-image-dialog',
  templateUrl: './main-select-custom-image-dialog.component.html',
  styleUrls: ['./main-select-custom-image-dialog.component.scss']
})
export class MainSelectCustomImageDialogComponent implements OnInit {

  public selectCustomImageForm: UntypedFormGroup;
  public customImageOptions: any[];
  public heading = 'Select custom image';
  public textContent = 'Select a custom image from this workspace';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      heading: string;
      text: string;
      workspaceId: string;
    },
    private customImageService: CustomImageService,
    private dialogRef: MatDialogRef<MainSelectCustomImageDialogComponent>,
    private formBuilder: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    const cis = this.customImageService.getCustomImagesByWorkspaceId(this.data.workspaceId).sort(
      (a,b) => Number(b.started_at) - Number(a.started_at));

    const completedCis = cis.filter(x => x.state === BuildState.Completed);
    const customImages = completedCis ? Object.assign([], completedCis).reverse() : [];

    this.customImageOptions = [];
    for (let ci of customImages) {
      this.customImageOptions.push(
        {
          value: ci.url,
          viewValue: ci.name,
        }
      );
    }
    this.selectCustomImageForm = this.formBuilder.group({
      selectedCustomImageUrl: [''],
    });

    if (this.data.heading) {
      this.heading = this.data.heading;
    }

    if (this.data.text) {
      this.textContent = this.data.text;
    }
  }

  closeForm(): void {
    this.dialogRef.close(null);
  }

  selectCustomImage(): void {
    this.dialogRef.close(this.selectCustomImageForm.controls.selectedCustomImageUrl.value);
  }

  isFormReady(): boolean {
    return this.selectCustomImageForm.controls.selectedCustomImageUrl.value;
  }
}
