import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Data } from '@angular/router';
import { Application } from 'src/app/models/application';
import { MembershipType, Workspace } from 'src/app/models/workspace';
import { ApplicationService } from 'src/app/services/application.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-workspace-item',
  templateUrl: './main-workspace-item.component.html',
  styleUrls: ['./main-workspace-item.component.scss'],
  standalone: false
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

  get isExpiredSoon(): boolean {
    const dayDifference = Utilities.getTimeGap(this.workspace.expiry_ts * 1000, 'day');
    return dayDifference < 7 && dayDifference >= 0;
  }

  get membershipType(): string {
    return this.workspace.membership_type === MembershipType.Manager ? 'co-owner' : this.workspace.membership_type;
  }

  constructor(
    public workspaceService: WorkspaceService,
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
