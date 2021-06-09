import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { EnvironmentCategoryService } from 'src/app/services/environment-category.service';

@Component({
  selector: 'app-main-content-header',
  templateUrl: './main-content-header.component.html',
  styleUrls: ['./main-content-header.component.scss']
})
export class MainContentHeaderComponent implements OnInit {

  @Input() content: any;
  @Input() isSearchOn: boolean;
  @Input() isAutocompleteDisabled: boolean;
  @Output() emitApplyFilter = new EventEmitter<string>();

  isLabelRemovable = true;
  isLabelSelectable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedLabels: string[];
  inputCtrl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredLabels: Observable<string[]>;

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
    return this.allLabels.filter(label => !this.labels.includes(label));
  }

  get allLabels(): string[] {
    const categories = this.environmentCategoryService.getCategories();
    let allLabels = [];
    categories.forEach(env => {
      const newLabels = env.labels.filter(label => !allLabels.includes(label));
      allLabels = allLabels.concat(newLabels);
    });
    return allLabels;
  }

  constructor(
    private environmentCategoryService: EnvironmentCategoryService
  ) {
  }

  ngOnInit() {
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
