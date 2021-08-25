import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentCategory } from 'src/app/models/environment-category';
import { EnvironmentCategoryService } from 'src/app/services/environment-category.service';
import { Utilities } from 'src/app/utilities';
import { MainJoinWorkspaceDialogComponent } from '../main-join-workspace-dialog/main-join-workspace-dialog.component';

@Component({
  selector: 'app-main-catalog',
  templateUrl: './main-catalog.component.html',
  styleUrls: ['./main-catalog.component.scss']
})
export class MainCatalogComponent implements OnInit {

  public content = {
    path: 'catalog',
    title: 'Environments',
    identifier: 'catalog'
  };

  selectedCatalog: EnvironmentCategory;
  referenceEnvironmentId: string;
  queryText = '';

  get environments(): Environment[] {
    if (!this.environmentService.isInitialized) {
      return null;
    }
    let envs = this.environmentService.getEnvironments().filter(env => {
      env.name = Utilities.resetText(env.name);
      env.description = Utilities.resetText(env.description);
      return env.is_enabled;
    });
    envs = this.filterEnvironmentsByLabels(envs, this.selectedCatalog.labels, 'any');
    envs = this.filterEnvironmentsByText(envs, this.queryText);
    return this.sortEnvironments(envs);
  }

  constructor(
    public dialog: MatDialog,
    private environmentService: EnvironmentService,
    private catalogService: EnvironmentCategoryService,
    public workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    // ---- MEMO: getCategoryById('1') : 1 means 'all category'
    this.selectedCatalog = this.catalogService.getCategoryById('1');
  }

  openJoinWorkspaceDialog(): void {
    const dialogRef = this.dialog.open(MainJoinWorkspaceDialogComponent, {
      height: 'auto',
      width: '600px',
      data: {
        content: this.content
      }
    }).afterClosed().subscribe(_ => {
      console.log('Join workspace dialog done');
    });
  }

  // ---- Environment
  // ------------------------------------------------------------ //

  // TODO: this takes few seconds in UI to display.
  // Merging sort to fetchEnvironments reduces delay but still takes a sec.
  // Sort is called before fetchEnvironments to reduce, but still see minor glitch.
  sortEnvironments(environmentsCopy: Environment[]): Environment[] {
    // console.log('sortEnvironments is called');
    const defaultWorkspace = Workspace.SYSTEM_WORKSPACE_NAME;
    environmentsCopy.sort((a, b) => {
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
    return environmentsCopy;
  }

  filterEnvironmentsByLabels(objects: Environment[], catalogLabels: string[], method: string): Environment[] {
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

  filterEnvironmentsByText(objects: Environment[], term: string): Environment[] {
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
  getCatalogs(): EnvironmentCategory[] {
    return this.catalogService.getCategories();
  }

  changeCatalog($event): void {
    const catalogId = this.catalogService.getCategories()[$event.index].id;
    // console.log(catalogId);
    this.selectedCatalog = this.catalogService.getCategoryById(catalogId);
    // console.log('---- now you chose Catalog below ----');
    console.log(this.selectedCatalog);
  }
}
