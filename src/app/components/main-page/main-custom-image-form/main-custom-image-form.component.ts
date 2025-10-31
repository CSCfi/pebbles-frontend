import { AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren}
  from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { CustomImage, ImageContent } from "../../../models/custom-image";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-main-custom-image-form',
  templateUrl: './main-custom-image-form.component.html',
  styleUrls: ['./main-custom-image-form.component.scss'],
  standalone: false
})
export class MainCustomImageFormComponent implements OnInit, AfterViewInit {
  customImageFormGroup: FormGroup;
  createButtonClicked: boolean;
  generatedDockerfile: string;
  imageContent: ImageContent[] = [];
  formTitle = 'Create Custom Image';
  @ViewChild('dropdownSelect') dropdownSelect!: MatSelect;
  @ViewChildren('dynamicInput') packageInputFields!: QueryList<ElementRef>;
  @ViewChild('addAptButton', { read: MatButton }) addAptButtonRef!: MatButton;


  constructor(
    public dialogRef: MatDialogRef<MainCustomImageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      baseImages: string[],
      previousVersion: CustomImage,
      commonImagePrefix: string,
    },
    private formBuilder: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    const formConfig = {
      name: ['', [Validators.required, Validators.maxLength(64)]],
      baseImage: ['', [Validators.required, Validators.maxLength(128)]],
    };
    this.customImageFormGroup = this.formBuilder.group(formConfig);

    if (this.data.previousVersion) {
      const image_name = this.data.previousVersion.name;
      this.formTitle = 'Create a new image based on "' + image_name + '"';

      // check if the name of the previous version has a generated version number
      const re = /^.*\s-\sv(\d+)$/;
      const match = image_name.match(re);
      if (match) {
        const incremented_image_name = image_name.replace(/\s-\sv(\d+)$/, " - v" + String(Number(match[1]) + 1));
        this.customImageFormGroup.controls.name.setValue(incremented_image_name);
        // if no version number, add 'v2' suffix as a suggestion
      } else {
        this.customImageFormGroup.controls.name.setValue(this.data.previousVersion.name + " - v2");
      }

      const def = this.data.previousVersion.definition;
      if (def) {
        this.customImageFormGroup.controls.baseImage.setValue(def.base_image);
        if (def.image_content?.length > 0) {
          this.imageContent = def.image_content;
        }
      }
    }
    this.updateDynamicFields();
    this.updateDockerfile();
  }

  ngAfterViewInit(): void {
    this.packageInputFields.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        setTimeout(() => {
          list.last.nativeElement.focus();
        });
      }
    });
  }

  updateDynamicFields() {
    // create a new control for each imagecontent item for the html form element to refer to
    for (let i = 0; i < this.imageContent?.length; i++) {
      const ic = this.imageContent[i];
      const fc = new FormControl(`ic-${i}`);
      fc.setValue(ic.data);
      this.customImageFormGroup.addControl(
        `ic-${i}`,
        fc
      );
    }
  }

  closeForm() {
    this.dialogRef.close({
      name: this.customImageFormGroup.controls.name.value,
      definition: {
        base_image: this.customImageFormGroup.controls.baseImage.value,
        user: 'jovyan',
        image_content: this.imageContent.filter(ic => ic.data),
      },
    });
  }

  updateExtraContent(): void {
    // update model from form
    for (let i = 0; i < this.imageContent?.length; i++) {
      this.imageContent[i].data = this.customImageFormGroup.controls[`ic-${i}`].value;
    }
    this.updateDockerfile();
  }

  updateDockerfile(): void {
    if (this.customImageFormGroup.controls.baseImage.value) {
      this.generatedDockerfile = `FROM ${this.customImageFormGroup.controls.baseImage.value}\n`;
    } else {
      this.generatedDockerfile = '';
    }
    this.imageContent.map((c) => {
      this.generatedDockerfile += '\n';
      this.generatedDockerfile += this.generateDockerInstructions(c);
    });
  }

  getContentDescription(kind: string) {
    if (kind == "aptPackages") {
      return "apt packages"
    } else if (kind == "pipPackages") {
      return "pip packages"
    } else if (kind == "condaForgePackages") {
      return "conda-forge packages"
    } else {
      return kind
    }
  }

  generateDockerInstructions(ic: ImageContent) {
    if (!ic.data) {
      return '';
    }
    switch (ic.kind) {
      case 'aptPackages':
        return [
          '# apt packages',
          'USER root',
          `RUN apt-get update && apt-get install -y ${ic.data} && apt-get clean`,
          'USER jovyan',
          ''
        ].join('\n');
      case 'pipPackages':
        return [
          '# pip packages',
          `RUN pip --no-cache-dir install --upgrade ${ic.data}`,
          ''
        ].join('\n');
      case 'condaForgePackages':
        return [
          '# conda packages',
          `RUN conda install -c conda-forge --yes ${ic.data}`
        ].join('\n');
    }
    return "";
  }

  // add a new content field of given type
  addImageContent(icType: string): void {
    this.imageContent.push({
      kind: icType,
      data: ''
    });
    this.updateDynamicFields();
  }

  // remove a content field
  removeImageContent(index: number): void {
    this.imageContent.splice(index, 1);
    this.customImageFormGroup.removeControl(`ic-${index}`);
    this.updateDockerfile();
  }

  extractBaseImageName(baseImage: string): string {
    return baseImage.replace(this.data.commonImagePrefix, '').trim();
  }

  //---- Preventing from the input filed removal by Enter key
  preventSubmit(event: Event): void {
    event.preventDefault();
  }

  focusNextElement(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const targetElement = keyboardEvent.target as HTMLElement;
    const currentElementId = targetElement.id

    switch (currentElementId) {
      case 'name-input':
        this.dropdownSelect.focus();
        break;
      case 'package-input':
        this.addAptButtonRef.focus();
        break;
    }
  }
}
