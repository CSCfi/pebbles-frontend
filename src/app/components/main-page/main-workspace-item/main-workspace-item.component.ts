import { Component, Input, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Data } from '@angular/router';
import { Application } from 'src/app/models/application';
import { LifeCycleNote, MembershipType, Workspace } from 'src/app/models/workspace';
import { ApplicationService } from 'src/app/services/application.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-item',
  templateUrl: './main-workspace-item.component.html',
  styleUrls: ['./main-workspace-item.component.scss'],
  standalone: false
})
export class MainWorkspaceItemComponent {

  @Input() workspace: Workspace;
  @Input() isNew!: boolean;
  @Input() context: Data;
  @Input() panelOpenState = false;

  @ViewChild('appTree') appTree!: MatExpansionPanel;

  get isAppTreeOpen(): boolean {
    const hasApps = this.applications && this.applications.length > 0;
    return this.panelOpenState && hasApps;
  }

  get applications(): Application[] {
    if (this.workspace && this.applicationService.isInitialized) {
      return this.applicationService.getApplicationsByWorkspaceId(this.workspace.id).filter(x => x.is_enabled);
    }
    return null;
  }

  get membershipType(): string {
    return this.workspace.membership_type === MembershipType.Manager ? 'co-owner' : this.workspace.membership_type;
  }

  constructor(
    public workspaceService: WorkspaceService,
    private applicationService: ApplicationService,
  ) {
  }

  toggleApplicationList(): void {
    if (this.applications && this.applications.length > 0) {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // directToApplication(applicationId: string): void {
  //   // this.router.navigateByUrl('/main/catalog#' + applicationId);
  //   this.router.navigate(['/main/catalog'], {queryParams: {id: applicationId}});
  // }

  getLifecycleNote(): LifeCycleNote {
    return this.workspaceService.getLifecycleNote(this.workspace);
  }

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe();
  }
}
