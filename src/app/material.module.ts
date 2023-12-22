import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
// import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatExpansionModule } from '@angular/material/expansion';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule( {
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    // MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    // MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [
    // BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    // MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    // MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
} )
export class MaterialModule{ }
