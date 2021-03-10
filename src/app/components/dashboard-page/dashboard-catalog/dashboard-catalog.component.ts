import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentCategory } from 'src/app/models/environment-category';
import { EnvironmentCategoryService } from 'src/app/services/environment-category.service';
import { DashboardMyWorkspacesComponent } from '../dashboard-my-workspaces/dashboard-my-workspaces.component';

@Component({
  selector: 'app-dashboard-catalog',
  templateUrl: './dashboard-catalog.component.html',
  styleUrls: ['./dashboard-catalog.component.scss']
})
export class DashboardCatalogComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public content = {
    path: 'catalog',
    title: 'Environments',
    identifier: 'catalog'
  };

  isSearchFormOpen = false;
  selectedCatalog: EnvironmentCategory;

  constructor(
    public dialog: MatDialog,
    private environmentService: EnvironmentService,
    private catalogService: EnvironmentCategoryService,
    public workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    this.fetchEnvironments();
    this.fetchCatalogs();
    this.fetchWorkspaces();
    this.isSearchFormOpen = false;
    // ---- getCategoryById('1') : 1 means 'all category'
    this.selectedCatalog = this.catalogService.getCategoryById('1');
  }

  openJoinWorkspaceDialog(): void {
    const dialogRef = this.dialog.open(DashboardMyWorkspacesComponent, {
      height: 'auto', width: '600px'
    });
    dialogRef.componentInstance.isPage = false;
  }

  // ---- Environment
  // ------------------------------------------------------------ //

  fetchEnvironments(): void {
    this.environmentService.fetchEnvironments().subscribe(() => {
      console.log('environments fetched');
    });
  }

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

  filterEnvironmentsByLabels(catalogLabels: string[], method: string): Environment[] {
    let environments = this.environmentService.getEnvironments().filter(env => env.is_enabled);
    environments = this.sortEnvironments(environments);
    if (catalogLabels.length === 0) {
      // ---- ALL catalog tab
      return environments;
    } else {

      if (method === 'any') {
        // ---- Any label matches search
        return environments.filter(env => {
          const envLabels = env.labels.map(label => label.toLowerCase());
          for (const x of catalogLabels) {
            if (envLabels.includes(x.toLowerCase())) {
              return true;
            }
          }
        });
      } else {
        // ---- All labels match search
        return environments.filter(env => {
          const envLabels = env.labels.map(label => label.toLowerCase());
          return catalogLabels.every(catLabel => envLabels.includes(catLabel.toLowerCase()));
        });
      }
    }
  }

  // ---- Catalogs
  // ------------------------------------------------------------ //
  getCatalogs(): EnvironmentCategory[] {
    return this.catalogService.getCategories();
  }

  fetchCatalogs(): void {
    this.catalogService.fetchCategories().subscribe(() => {
      console.log('catalogs fetched');
    });
  }

  changeCatalog($event): void {
    const catalogId = this.catalogService.getCategories()[$event.index].id;
    // console.log(catalogId);
    this.selectedCatalog = this.catalogService.getCategoryById(catalogId);
    // console.log('---- now you chose Catalog below ----');
    console.log(this.selectedCatalog);
  }

  // ---- Workspace
  // ------------------------------------------------------------ //
  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  getWorkspaceById(workspaceId: string): Workspace {
    const workspaces = this.workspaceService.getWorkspaces();
    return workspaces.find(ws => ws.id === workspaceId);
  }
}
