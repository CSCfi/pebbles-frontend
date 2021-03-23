import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentService } from '../../../services/environment.service';
import { DashboardEnvironmentFormComponent } from '../dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from '../dashboard-workspace-form/dashboard-workspace-form.component';
import { DialogComponent } from '../../shared/dialog/dialog.component';


@Component({
  selector: 'app-dashboard-workspace-item-detail',
  templateUrl: './dashboard-workspace-item-detail.component.html',
  styleUrls: ['./dashboard-workspace-item-detail.component.scss']
})
export class DashboardWorkspaceItemDetailComponent implements OnInit {

  @Input() workspace: Workspace;
  // selectedTabLabel: string;
  // tabLabels = ['environments', 'members', 'Profile'];
  isPlainFormOn = false;

  public content = {
    path: 'workspace-owner/detail/:id',
    title: 'Workspace item Detail',
    identifier: 'workspace-owner-item-detail'
  };

  // get selectedTabIndex(): number {
  //   if (this.selectedTabLabel) {
  //     return this.tabLabels.indexOf(this.selectedTabLabel);
  //   } else {
  //     return 0;
  //   }
  // }

  // get environments(): Environment[] {
  //   return this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  // }

  constructor(
    // private route: ActivatedRoute,
    public dialog: MatDialog,
    // private workspaceService: WorkspaceService,
    // private environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    // // this.getWorkspaceById(this.workspaceId);
    // this.environmentService.fetchEnvironments().subscribe();
    // // ---- To know which button in the manage workspace was clicked
    // if (window.history.state) {
    //   this.selectedTabLabel = window.history.state.label;
    // }
  }

  // getEnvironments(): Environment[] {
  //   const environments = this.environmentService.getEnvironmentsByWorkspaceId(this.workspace.id);
  //   return environments.sort((a, b) => Number(b.is_enabled) - Number(a.is_enabled));
  // }

  // getWorkspaceById(workspaceId: string): void {
  //   this.workspaceService.fetchWorkspaces().subscribe((resp) => {
  //     this.workspace = resp.find(ws => ws.id === workspaceId);
  //     this.content.title = `Workspace: ${this.workspace.name}`;
  //   });
  // }

  // openEditWorkspaceDialog(): void {
  //   const dialogRef = this.dialog.open(DashboardWorkspaceFormComponent, {
  //       width: '800px',
  //       height: 'auto',
  //       data: {
  //         isCreationMode: false,
  //         workspace: this.workspace
  //       }
  //     }).afterClosed().subscribe(_ => {
  //       this.getEnvironments();
  //     });
  // }

  // openEnvironmentCreationDialog(mode): void {
  //   this.isPlainFormOn = mode === 'wizard' ? false : true;
  //   const dialogRef = this.dialog.open(DashboardEnvironmentFormComponent, {
  //       width: this.isPlainFormOn ? '800px' : '1000px',
  //       height: 'auto',
  //       maxHeight: '90vh',
  //       data: {
  //         isPlainFormOn: this.isPlainFormOn,
  //         workspaceId: this.workspace.id
  //       }
  //     }).afterClosed().subscribe( _ => {
  //       this.getEnvironments();
  //     });
  // }

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
    dialogRef.afterClosed().subscribe( _ => {
      console.log('The dialog was closed');
    });
  }
}
