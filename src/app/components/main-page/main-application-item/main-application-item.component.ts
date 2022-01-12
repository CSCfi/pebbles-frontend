import { Component, Input, OnInit } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { ApplicationType } from '../../../models/application-template';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-main-application-item',
  templateUrl: './main-application-item.component.html',
  styleUrls: ['./main-application-item.component.scss']
})
export class MainApplicationItemComponent implements OnInit {

  faBook = faBook;
  faRProject = faRProject;
  faPython = faPython;

  @Input() application: Application;
  @Input() content: any;

  get isPublic(): boolean {
    return this.application.workspace_name.startsWith('System.');
  }

  get isWorkVolumeActive(): boolean {
    return !!this.application.info?.work_folder_enabled;
  }

  get labels(): string {
    return this.application.labels.join(', ');
  }

  get lifetime(): string {
    const hours = Number(this.application.maximum_lifetime) / 3600;
    const mins = Number(this.application.maximum_lifetime) % 3600;
    return (hours > 0 ? `${hours}h` : '') + (mins > 0 ? `${mins / 100}m` : '');
  }

  get applicationType(): ApplicationType {
    return this.application?.application_type;
  }

  get description(): string {
    if (this.application && this.application.description) {
      return this.application.description;
    } else {
      return 'The application has no description.';
    }
  }

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
