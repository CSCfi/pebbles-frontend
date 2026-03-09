import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
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
  styleUrls: ['./main-my-workspaces.component.scss'],
  standalone: false
})
export class MainMyWorkspacesComponent implements OnInit {

  public context: Data;
  @ViewChildren(MainWorkspaceItemComponent) workspaceItems: QueryList<MainWorkspaceItemComponent>;

  public newWorkspaceId: string;
  public isListOpen = true;
  public queryText = '';
  public filteredWorkspaces: Workspace[] = null;
  protected readonly Utilities = Utilities;
  private allWorkspaces: Workspace[] = null;

  get workspaceCount(): number {
    return this.workspaceService.getWorkspaces().length;
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

    this.eventService.workspacesDataUpdate$.subscribe(wss => {
      if (wss) {
        this.allWorkspaces = wss;
        this.updateVisibleWorkspaces();
      }
    });
    this.workspaceService.fetchWorkspaces().subscribe();
  }

  applyFilter(value: string): void {
    this.queryText = value;
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

  private updateVisibleWorkspaces(): void {
    if (!this.allWorkspaces) return;

    let wss = this.allWorkspaces.map(ws => ({
      ...ws,
      name: Utilities.resetText(ws.name),
      description: Utilities.resetText(ws.description)
    }));

    wss = Workspace.sortWorkspaces(wss, ['expiry', 'create_ts']);
    this.filteredWorkspaces = this.searchService.filterByText(wss, this.queryText, ['name', 'description']);
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

  protected workspaceTrackBy(_index: number, ws: Workspace): string {
    return ws.id;
  }
}
