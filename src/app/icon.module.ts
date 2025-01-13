import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faJs, faPython, faRProject, faDocker} from '@fortawesome/free-brands-svg-icons';
import {
  faAtom,
  faBook,
  faBrain,
  faChartColumn,
  faCircleNodes,
  faCode,
  faDna,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';

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
      faChartColumn,
      faCircleNodes,
      faDocker
    );
  }
}
