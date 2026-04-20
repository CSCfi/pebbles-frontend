import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from "rxjs";
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';
import { EventService } from '../../../services/event.service';
import { SearchService } from '../../../services/search.service';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';
import { PublicConfigService } from "../../../services/public-config.service";

@Component({
  selector: 'app-main-my-workspaces',
  templateUrl: './main-my-workspaces.component.html',
  styleUrls: ['./main-my-workspaces.component.scss'],
  standalone: false
})
export class MainMyWorkspacesComponent implements OnInit, OnDestroy {

  public context: Data;
  public newWorkspaceId: string;
  public isListOpen = true;
  public queryText = '';
  public filteredWorkspaces: Workspace[] = null;
  protected readonly Utilities = Utilities;
  private allWorkspaces: Workspace[] = null;

  // store subscriptions here for unsubscribing destroy time
  private subscriptions: Subscription[] = [];

  get workspaceCount(): number {
    return this.workspaceService.getWorkspaces().length;
  }

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private searchService: SearchService,
    public publicConfigService: PublicConfigService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });

    this.subscriptions.push(this.eventService.workspaceDataUpdate$.subscribe(_ => {
        this.allWorkspaces = this.workspaceService.getWorkspaces();
        this.updateVisibleWorkspaces();
      }
    ));
    console.log(`observers: ${this.eventService.workspaceDataUpdate$.observers}`);
    // if workspace service already has the data, assign
    if (this.workspaceService.isInitialized) {
      this.allWorkspaces = this.workspaceService.getWorkspaces();
      this.updateVisibleWorkspaces();
    }
    // otherwise call for a fetch and handle the assignment in listener
    else {
      this.workspaceService.fetchWorkspaces().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  applyFilter(value: string): void {
    this.queryText = value;
    this.updateVisibleWorkspaces();
  }

  toggleWorkspaceList(): void {
    this.isListOpen = !this.isListOpen;
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
