import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faRProject, faPython, faJs } from '@fortawesome/free-brands-svg-icons';
import { faBook, faCode, faBrain, faAtom, faDna, faLanguage, faChartColumn } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class IconModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faRProject,
      faPython,
      faJs,
      faCode,
      faBook,
      faBrain,
      faAtom,
      faDna,
      faLanguage,
      faChartColumn
    );
  }
}
