import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-dashboard-search-box',
  templateUrl: './dashboard-search-box.component.html',
  styleUrls: ['./dashboard-search-box.component.scss']
})
export class DashboardSearchBoxComponent {

  selectable = true;
  removable = true;
  color = 'accent';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl();
  filteredLabels: Observable<string[]>;

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  private currentLabels: string[];

  constructor(
    private environmentService: EnvironmentService,
  ) {
  }

  // labels: EnvironmentCategory;

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
    const environments = this.environmentService.getEnvironments();
    let allLabels = [];
    environments.forEach(env => {
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
    // console.log(event);
    this.labels.push($event.target.innerText);
  }

  getCandidateLabels() {
    return this.allLabels.filter(label => !this.labels.includes(label));
  }

  saveLabels() {
    console.log('---- Write later for saving the tab with search labels ----');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLabels.filter(label => label.toLowerCase().indexOf(filterValue) === 0);
  }
}
