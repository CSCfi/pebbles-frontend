import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Data } from '@angular/router';
import { ApplicationCategoryService } from 'src/app/services/application-category.service';

@Component({
  selector: 'app-main-content-header',
  templateUrl: './main-content-header.component.html',
  styleUrls: ['./main-content-header.component.scss']
})
export class MainContentHeaderComponent {

  @Input() context: Data;
  @Input() isSearchOn: boolean;
  @Input() isAutocompleteDisabled: boolean;
  @Output() emitApplyFilter = new EventEmitter<string>();

  public isLabelRemovable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  private selectedLabels: string[];
  public inputCtrl = new UntypedFormControl();

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;

  @Input() set labels(values: string[]) {
    // ---- MEMO: Apply deep copy to cut binding with original object
    this.selectedLabels = JSON.parse(JSON.stringify(values));
  }

  get labels(): string[] {
    if (this.selectedLabels) {
      return this.selectedLabels;
    } else {
      return [];
    }
  }

  get candidateLabels(): string[] {
    return this.allLabels(this.context.identifier).filter(label => !this.labels.includes(label));
  }

  allLabels(category): string[] {
    let allLabels = [];
    if (category === 'catalog') {
      const categories = this.applicationCategoryService.getCategories();
      categories.forEach(env => {
        const newLabels = env.labels.filter(label => !allLabels.includes(label));
        allLabels = allLabels.concat(newLabels);
      });
    }
    // ---- MEMO: Temporal labels, considered later.
    if (category === 'users') {
      allLabels = ['admins', 'workspace owners', 'blocked'];
    }
    return allLabels;
  }

  constructor(
    private applicationCategoryService: ApplicationCategoryService
  ) {
  }

  queryTextAdded(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.emitApplyFilter.emit(filterValue);
  }

  // addLabel(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;
  //   // ---- Add our label
  //   if ((value || '').trim()) {
  //     this.labels.push(value.trim());
  //   }
  //   // ---- Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  //   this.inputCtrl.setValue(null);
  // }

  removeLabel(label: string): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  // openPanel(): void {
  //   const self = this;
  //   setTimeout(() => {
  //     self.autoTrigger.openPanel();
  //   }, 1);
  // }

  labelSelected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.viewValue);
    this.labelInput.nativeElement.value = '';
    this.inputCtrl.setValue(null);
  }

  labelClicked($event): void {
    this.labels.push($event.target.innerText);
  }
}
