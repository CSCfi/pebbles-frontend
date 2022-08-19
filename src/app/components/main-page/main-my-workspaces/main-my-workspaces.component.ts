import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { Utilities } from 'src/app/utilities';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '../../../models/message';
import { EventService } from '../../../services/event.service';
import { SearchService } from '../../../services/search.service';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';
import { MainWorkspaceItemComponent } from '../main-workspace-item/main-workspace-item.component';

@Component({
  selector: 'app-main-my-workspaces',
  templateUrl: './main-my-workspaces.component.html',
})
export class MainMyWorkspacesComponent implements OnInit {

  public context: Data;
  @ViewChildren(MainWorkspaceItemComponent) workspaceItems: QueryList<MainWorkspaceItemComponent>;

  public newWorkspaceId: string;
  public isListOpen = true;
  public queryText = '';

  private subscriptions: Subscription[] = [];
  public message: Message;

  get workspaceCount(): number {
    return this.workspaceService.getWorkspaces().length;
  }

  get visibleWorkspaces(): Workspace[] {
    if (!this.workspaceService.isInitialized) {
      return null;
    }
    const wss = this.workspaceService.getWorkspaces().map(ws => {
      ws.name = Utilities.resetText(ws.name);
      ws.description = Utilities.resetText(ws.description);
      return ws;
    });
    return this.searchService.filterByText(wss, this.queryText, ['name', 'description']);
  }

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.subscriptions.push(this.eventService.messageDataUpdate$.subscribe(message => {
      this.message = message;
    }));
  }

  toggleWorkspaceList(): void {
    this.isListOpen = !this.isListOpen;
    this.workspaceItems.map( item => {
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
      width: '600px',
      autoFocus: false,
      data: {
        context: this.context
      }
    }).afterClosed().subscribe( ws => {
      if (ws) {
        this.newWorkspaceId = ws.id;
      }
    });
  }
}
