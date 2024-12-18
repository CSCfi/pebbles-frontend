import { Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA,  MatDialogRef} from "@angular/material/dialog";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { CustomImage, ImageContent } from "../../../models/custom-image";

@Component({
  selector: 'app-main-custom-image-form',
  templateUrl: './main-custom-image-form.component.html',
  styleUrls: ['./main-custom-image-form.component.scss']
})
export class MainCustomImageFormComponent implements OnInit {
  customImageFormGroup: FormGroup;
  createButtonClicked: boolean;
  baseImages: string[];
  generatedDockerfile: string;
  imageContent: ImageContent[] = [];

  constructor(
    public dialogRef: MatDialogRef<MainCustomImageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      baseImages: string[],
      previousVersion: CustomImage,
    },
    private formBuilder: UntypedFormBuilder,
  ) {
    this.baseImages = data.baseImages;
    this.imageContent.push({kind: 'aptPackages', data: ''})
    this.imageContent.push({kind: 'pipPackages', data: ''})
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.setCreationForm();
    this.updateDockerfile();
  }

  setCreationForm(): void {
    const formConfig = {
      name: ['', [Validators.required, Validators.maxLength(128)]],
      baseImage: ['foo.example.org/bar:latest', [Validators.required, Validators.maxLength(128)]],
    };
    formConfig['aptPackages'] = [''];
    formConfig['pipPackages'] = [''];
    this.customImageFormGroup = this.formBuilder.group(formConfig);
    if (this.data.previousVersion) {
      const def = this.data.previousVersion.definition;
      this.customImageFormGroup.controls.name.setValue(this.data.previousVersion.name);
      this.customImageFormGroup.controls.baseImage.setValue(def.base_image);
      for (const ic of def.image_content) {
        this.customImageFormGroup.controls[ic.kind].setValue(ic.data);
      }
    }
    this.updateExtraContent();
  }

  closeForm() {
    this.dialogRef.close({
      name: this.customImageFormGroup.controls.name.value,
      definition: {
        base_image: this.customImageFormGroup.controls.baseImage.value,
        user: 'jovyan',
        image_content: this.imageContent,
      },
    });
  }

  updateExtraContent(): void {
    for (const ic of this.imageContent) {
      ic.data = this.customImageFormGroup.controls[ic.kind].value;
    }
    this.updateDockerfile();
  }

  updateDockerfile(): void {
    this.generatedDockerfile = `FROM ${this.customImageFormGroup.controls.baseImage.value}\n`;
    this.imageContent.map((c) => {
      this.generatedDockerfile += '\n';
      this.generatedDockerfile += this.generateDockerInstructions(c);
    });
  }

  generateDockerInstructions(ic: ImageContent) {
    switch (ic.kind) {
      case 'aptPackages':
        if (!ic.data) {
          return '';
        }
        return [
          '# aptPackages',
          'USER root',
          `RUN apt-get update && apt-get install -y ${ic.data} && apt-get clean`,
          'USER jovyan',
          ''
        ].join('\n');
      case 'pipPackages':
        if (!ic.data) {
          return '';
        }
        return [
          '# pipPackages',
          `RUN pip --no-cache-dir install --upgrade ${ic.data}`,
          ''
        ].join('\n');
    }
    return "";
  }
}
