import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Data } from '@angular/router';
import { Application } from 'src/app/models/application';
import { UserAssociationType, Workspace } from 'src/app/models/workspace';
import { ApplicationService } from 'src/app/services/application.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-item',
  templateUrl: './main-workspace-item.component.html',
  styleUrls: ['./main-workspace-item.component.scss']
})
export class MainWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Input() isNew: boolean;
  @Input() context: Data;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState: boolean;

  get applications(): Application[] {
    if (this.workspace && this.applicationService.isInitialized) {
      return this.applicationService.getApplicationsByWorkspaceId(this.workspace.id).filter(x => x.is_enabled);
    }
    return null;
  }

  get userAssociationType(): string {
    return this.workspace.user_association_type === UserAssociationType.Manager ? 'co-owner' : this.workspace.user_association_type;
  }

  constructor(
    private workspaceService: WorkspaceService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit(): void {
    this.panelOpenState = true;
  }

  toggleApplicationList(): void {
    if (this.applications.length > 0) {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // directToApplication(applicationId: string): void {
  //   // this.router.navigateByUrl('/main/catalog#' + applicationId);
  //   this.router.navigate(['/main/catalog'], {queryParams: {id: applicationId}});
  // }

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe();
  }
}
