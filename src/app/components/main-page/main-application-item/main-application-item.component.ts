import { Component, Input } from '@angular/core';
import { Data } from '@angular/router';
import { Application } from 'src/app/models/application';
import { UserAssociationType } from '../../../models/workspace';
import { WorkspaceService } from '../../../services/workspace.service';
import { Utilities } from '../../../utilities';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-main-application-item',
  templateUrl: './main-application-item.component.html',
  styleUrls: ['./main-application-item.component.scss']
})
export class MainApplicationItemComponent {

  @Input() application: Application;
  @Input() context: Data;
  @Input() isSessionDeleted: boolean;

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

  get applicationIcon(): IconProp {
    return Utilities.getApplicationIcon(this.application.labels);
  }

  get applicationTypeName(): string {
    return Utilities.applicationTypeName(this.application.application_type);
  }

  get description(): string {
    if (this.application && this.application.description) {
      return this.application.description;
    } else {
      return 'The application has no description.';
    }
  }

  get userAssociationType(): string {
    const workspace = this.workspaceService.getWorkspaceById(this.application.workspace_id);
    if (workspace) {
      return workspace.user_association_type === UserAssociationType.Manager ? 'co-owner' : workspace.user_association_type;
    } else {
      return '';
    }
  }

  constructor(
    private workspaceService: WorkspaceService
  ) { }
}
