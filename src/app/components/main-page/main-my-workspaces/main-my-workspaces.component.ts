import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { Utilities } from 'src/app/utilities';
import { MatDialog } from '@angular/material/dialog';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';

@Component({
  selector: 'app-main-my-workspaces',
  templateUrl: './main-my-workspaces.component.html',
  styleUrls: ['./main-my-workspaces.component.scss']
})
export class MainMyWorkspacesComponent implements OnInit {

  public content = {
    path: 'my-workspaces',
    title: 'My workspaces',
    identifier: 'my-workspace'
  };

  public newWorkspace: Workspace;
  queryText = '';
  workspaceCount = 0;

  get workspaces(): Workspace[] {
    const wss = this.workspaceService.getWorkspaces().map(ws => {
      ws.name = Utilities.resetText(ws.name);
      ws.description = Utilities.resetText(ws.description);
      return ws;
    });
    return this.filterWorkspacesByText(wss, this.queryText);
  }

  constructor(
    public dialog: MatDialog,
    private workspaceService: WorkspaceService,
  ) { }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(resp => {
      this.workspaceCount = resp.length;
    });
  }

  applyFilter(value): void {
    this.queryText = value;
  }

  filterWorkspacesByText(objects: Workspace[], term: string): Workspace[] {
    term = Utilities.cleanText(term);
    if (term === '') {
      return objects;
    } else {
      objects = objects.filter(obj => {
        let isMatch = false;
        // ---- Search in name
        if (Utilities.cleanText(obj.name).indexOf(term) > -1) {
          obj.name = obj.name.replace(new RegExp(term, 'gi'), (match) => `<mark>${match}</mark>`);
          isMatch = true;
        }
        // ---- Search in description
        if (Utilities.cleanText(obj.description).indexOf(term) > -1) {
          obj.description = obj.description.replace(new RegExp(term, 'gi'), (match) => `<mark>${match}</mark>`);
          isMatch = true;
        }
        if (isMatch) {
          return obj;
        }
      });
    }
    return objects;
  }

  openJoinWorkspaceDialog(): void {
    const dialogRef = this.dialog.open(MainJoinWorkspaceDialogComponent, {
      height: 'auto', width: '600px'
    });
    dialogRef.componentInstance.content = this.content;
  }
}
