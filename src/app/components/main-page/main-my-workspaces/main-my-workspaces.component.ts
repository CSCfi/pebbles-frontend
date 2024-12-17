import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';
import { EventService } from '../../../services/event.service';
import { SearchService } from '../../../services/search.service';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';
import { MainWorkspaceItemComponent } from '../main-workspace-item/main-workspace-item.component';

@Component({
  selector: 'app-main-my-workspaces',
  templateUrl: './main-my-workspaces.component.html',
  styleUrls: ['./main-my-workspaces.component.scss']
})
export class MainMyWorkspacesComponent implements OnInit {

  public context: Data;
  @ViewChildren(MainWorkspaceItemComponent) workspaceItems: QueryList<MainWorkspaceItemComponent>;

  public newWorkspaceId: string;
  public isListOpen = true;
  public queryText = '';

  private subscriptions: Subscription[] = [];

  get workspaceCount(): number {
    return this.workspaceService.getWorkspaces().length;
  }

  get visibleWorkspaces(): Workspace[] {
    if (!this.workspaceService.isInitialized) {
      return null;
    }
    let wss = this.workspaceService.getWorkspaces().filter(ws => {
      ws.name = Utilities.resetText(ws.name);
      ws.description = Utilities.resetText(ws.description);
      return ws;
    });

    wss = Workspace.sortWorkspaces(wss, ['expiry', 'create_ts']);

    return this.searchService.filterByText(wss, this.queryText, ['name', 'description']);
  }

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
  }

  toggleWorkspaceList(): void {
    this.isListOpen = !this.isListOpen;
    this.workspaceItems.map(item => {
      if (item.accordion) {
        if (this.isListOpen) {
          item.accordion.openAll();
        } else {
          item.accordion.closeAll();
        }
      }
    });
  }

  applyFilter(value): void {
    this.queryText = value;
  }

  openJoinWorkspaceDialog(): void {
    this.dialog.open(MainJoinWorkspaceDialogComponent, {
      height: 'auto',
      width: '700px',
      autoFocus: false,
      data: {
        context: this.context
      }
    }).afterClosed().subscribe(ws => {
      if (ws) {
        this.newWorkspaceId = ws.id;
      }
    });
  }
}
