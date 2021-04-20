import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-main-workspace-item',
  templateUrl: './main-workspace-item.component.html',
  styleUrls: ['./main-workspace-item.component.scss']
})
export class MainWorkspaceItemComponent implements OnInit {

  @Input() workspace: Workspace;
  @Input() content: any;
  @Output() fetchWorkspacesEvent = new EventEmitter();

  // ---- Activate below when lifetime is introduced in workspace
  // lifetime: number;

  showJoinCode: boolean;
  panelOpenState: boolean;

  get environments(): Environment[] {
    return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) {
    // this.lifetime = 120; // ---- dummy value for now
    this.showJoinCode = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
  }

  toggleEnvironmentList(): void {
    if (this.environments.length > 0) {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  // ---- My Workspaces ---- //

  exitWorkspace(): void {
    if (!confirm(`Are you sure you want to leave workspace "${this.workspace.name}"?`)) {
      return;
    }
    this.workspaceService.exitWorkspace(this.workspace.id).subscribe(() => {
      this.fetchWorkspacesEvent.emit();
    });
  }

  // ---- Manage Workspaces ---- //

  openWorkspaceDetail(tab): void {
    this.router.navigateByUrl(
      `/main/workspace-owner/detail/${this.workspace.id}`,
      { state: { label: tab } });
  }

  openJoinCodeDialog(): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      width: '500px',
      data: {
        dialogTitle: 'Workspace Join Code',
        dialogContent: `<p>Share the join code below to the users you want to share your workspace.</p>`,
        dialogClipboard: this.workspace.join_code,
        dialogActions: ['close']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
