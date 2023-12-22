import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyAutocomplete as MatAutocomplete, MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { Observable } from 'rxjs';
import { ApplicationCategoryService } from 'src/app/services/application-category.service';

@Component({
  selector: 'app-main-search-box',
  templateUrl: './main-search-box.component.html',
  styleUrls: ['./main-search-box.component.scss']
})
export class MainSearchBoxComponent {

  selectable = true;
  removable = true;
  color = 'accent';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new UntypedFormControl();
  filteredLabels: Observable<string[]>;

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  private currentLabels: string[];

  constructor(
    private applicationCategoryService: ApplicationCategoryService,
  ) {
  }

  // labels: ApplicationCategory;

  get labels(): string[] {
    if (this.currentLabels) {
      return this.currentLabels;
    } else {
      return [];
    }
  }

  @Input() set labels(values: string[]) {
    this.currentLabels = values;
  }

  get allLabels(): string[] {
    const categories = this.applicationCategoryService.getCategories();
    let allLabels = [];
    categories.forEach(env => {
      const newLabels = env.labels.filter(label => !allLabels.includes(label));
      allLabels = allLabels.concat(newLabels);
    });
    return allLabels;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // ---- Add our label
    if ((value || '').trim()) {
      this.labels.push(value.trim());
    }

    // ---- Reset the input value
    if (input) {
      input.value = '';
    }

    this.labelCtrl.setValue(null);
  }

  removeLabel(label: string): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.viewValue);
    this.labelInput.nativeElement.value = '';
    this.labelCtrl.setValue(null);
  }

  clicked($event): void {
    this.labels.push($event.target.innerText);
  }

  getCandidateLabels() {
    return this.allLabels.filter(label => !this.labels.includes(label));
  }

  saveLabels() {
    // Write later for saving the tab with search labels
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLabels.filter(label => label.toLowerCase().indexOf(filterValue) === 0);
  }
}
