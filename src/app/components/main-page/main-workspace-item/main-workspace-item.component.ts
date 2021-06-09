import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-main-workspace-item',
  templateUrl: './main-workspace-item.component.html',
  styleUrls: ['./main-workspace-item.component.scss']
})
export class MainWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Output() fetchWorkspacesEvent = new EventEmitter();
  panelOpenState: boolean;
  environments: Environment[];

  constructor(
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
  }

  ngOnInit(): void {
    this.panelOpenState = true;
    if (this.workspace) {
      this.environmentService.fetchEnvironments().subscribe(_ => {
        this.environments = this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
      });
    }
  }

  toggleEnvironmentList(): void {
    if (this.environments.length > 0) {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // directToEnvironment(environmentId: string): void {
  //   // this.router.navigateByUrl('/main/catalog#' + environmentId);
  //   this.router.navigate(['/main/catalog'], {queryParams: {id: environmentId}});
  // }

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe(() => {
      this.fetchWorkspacesEvent.emit();
    });
  }
}
