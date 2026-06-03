import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDocker, faJs, faLinux, faPython, faRProject } from '@fortawesome/free-brands-svg-icons';
import {
  faAtom, faBook, faBrain, faChartColumn, faCircleNodes, faCode, faDna, faLanguage, faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { CustomLinuxIconComponent } from "./components/shared/icons/custom-linux-icon.component";

@NgModule({
  declarations: [
    CustomLinuxIconComponent
  ],
  exports: [
    CustomLinuxIconComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class IconModule {
  private library = inject(FaIconLibrary);

  constructor() {
    // Add an icon to the library for convenient access in other components
    this.library.addIcons(
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
      faDocker,
      faLinux,
      faMapLocationDot
    );
  }
}
