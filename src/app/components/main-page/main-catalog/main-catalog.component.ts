import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Application } from 'src/app/models/application';
import { ApplicationCategory } from 'src/app/models/application-category';
import { Message, MessageType } from 'src/app/models/message';
import { Workspace } from 'src/app/models/workspace';
import { ApplicationCategoryService } from 'src/app/services/application-category.service';
import { ApplicationService } from 'src/app/services/application.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';
import { EventService } from '../../../services/event.service';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';

@Component({
  selector: 'app-main-catalog',
  templateUrl: './main-catalog.component.html',
  styleUrls: ['./main-catalog.component.scss']
})
export class MainCatalogComponent implements OnInit {

  public context: Data;
  public selectedCatalog: ApplicationCategory;
  public referenceApplicationId: string;
  public queryText = '';

  private subscriptions: Subscription[] = [];
  public message: Message;

  get applications(): Application[] {
    if (!this.applicationService.isInitialized) {
      return null;
    }
    let apps = this.applicationService.getApplications().filter(app => {
      app.name = Utilities.resetText(app.name);
      app.description = Utilities.resetText(app.description);
      return app.is_enabled;
    });
    apps = this.filterApplicationsByLabels(apps, this.selectedCatalog.labels, 'any');
    apps = this.filterApplicationsByText(apps, this.queryText);
    return this.sortApplications(apps);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private eventService: EventService,
    private applicationService: ApplicationService,
    private catalogService: ApplicationCategoryService,
    public workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.subscriptions.push(this.eventService.messageDataUpdate$.subscribe(message => {
      this.message = message;
    }));
    // ---- MEMO: getCategoryById('1') : 1 means 'all category'
    this.selectedCatalog = this.catalogService.getCategoryById('1');
  }

  openJoinWorkspaceDialog(): void {
    this.dialog.open(MainJoinWorkspaceDialogComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: false,
      data: {
        context: this.context
      }
    }).afterClosed().subscribe();
  }

  // ---- application
  // ------------------------------------------------------------ //

  // TODO: this takes few seconds in UI to display.
  // Merging sort to fetchApplications reduces delay but still takes a sec.
  // Sort is called before fetchApplications to reduce, but still see minor glitch.
  sortApplications(apps: Application[]): Application[] {
    const defaultWorkspace = Workspace.SYSTEM_WORKSPACE_NAME;
    apps.sort((a, b) => {
      if ((('' + a.workspace_name).localeCompare(defaultWorkspace) === 0) &&
        (('' + b.workspace_name).localeCompare(defaultWorkspace) === 0)) {
        return (('' + a.name).localeCompare(b.name));
      }
      else if ((('' + a.workspace_name).localeCompare(defaultWorkspace) === 0) ||
        (('' + b.workspace_name).localeCompare(defaultWorkspace) === 0)) {
        if (('' + a.workspace_name).localeCompare(defaultWorkspace) === 0) { return 1; }
        else if (('' + b.workspace_name).localeCompare(defaultWorkspace) === 0) { return -1; }
      }
      else {
        return (('' + a.name).localeCompare(b.name));
      }
    });
    return apps;
  }

  filterApplicationsByLabels(objects: Application[], catalogLabels: string[], method: string): Application[] {
    if (catalogLabels.length === 0) {
      // ---- ALL catalog tab
      return objects;

    } else {

      if (method === 'any') {
        // ---- Any label matches search
        return objects.filter(obj => {
          const objLabels = obj.labels.map(label => label.toLowerCase());
          for (const x of catalogLabels) {
            if (objLabels.includes(x.toLowerCase())) {
              return true;
            }
          }
        });

      } else {
        // ---- All labels match search
        return objects.filter(obj => {
          const objLabels = obj.labels.map(label => label.toLowerCase());
          return catalogLabels.every(catLabel => objLabels.includes(catLabel.toLowerCase()));
        });
      }
    }
  }

  applyFilter(value: string): void {
    this.queryText = value;
  }

  filterApplicationsByText(objects: Application[], term: string): Application[] {
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
        // ---- Search in label
        if (obj.labels.indexOf(term) > -1) {
          isMatch = true;
        }
        if (isMatch) {
          return obj;
        }
      });
    }
    return objects;
  }

  // ---- Catalogs
  // ------------------------------------------------------------ //
  getCatalogs(): ApplicationCategory[] {
    return this.catalogService.getCategories();
  }

  changeCatalog($event): void {
    this.selectedCatalog = this.catalogService.getCategoryById(this.catalogService.getCategories()[$event.index].id);
  }
}
