import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Workspace } from 'src/app/models/workspace';
import { Utilities } from 'src/app/utilities';
import { MatDialog } from '@angular/material/dialog';
import { Message, MessageType } from '../../../models/message';
import { EventService } from '../../../services/event.service';
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
    return this.filterWorkspacesByText(wss, this.queryText);
  }

  constructor(
    public dialog: MatDialog,
     private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
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
