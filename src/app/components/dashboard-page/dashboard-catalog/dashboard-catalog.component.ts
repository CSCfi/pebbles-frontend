import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';

import { InstanceStates } from 'src/app/models/instance';
import { InstanceService } from 'src/app/services/instance.service';
import { Environment } from 'src/app/models/environment';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EnvironmentCategory } from 'src/app/models/environment-category';
import { EnvironmentCategoryService } from 'src/app/services/environment-category.service';
// import * as TESTDATA from 'src/app/interceptors/test-data';
// import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard-catalog',
  templateUrl: './dashboard-catalog.component.html',
  styleUrls: ['./dashboard-catalog.component.scss']
})
export class DashboardCatalogComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public content = {
    path: 'catalog',
    title: 'Environment Catalog'
  };

  isSearchFormOpen = false;
  selectedCatalog: EnvironmentCategory;

  // public workspaces: Workspace[];

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private environmentService: EnvironmentService,
    private catalogService: EnvironmentCategoryService,
    private instanceService: InstanceService,
    public workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    this.fetchEnvironments();
    this.fetchCatalogs();
    this.fetchWorkspaces();
    this.isSearchFormOpen = false;
    // ---- getCategoryById('1') : 1 -> 'all'
    this.selectedCatalog = this.catalogService.getCategoryById('1');
  }

  openJoinWorkspaceDialog() {
    this.dialog.open(JoinWorkspaceDialogComponent);
  }

  // ---- Environment
  // ------------------------------------------------------------ //
  getEnvironments(): Environment[] {
    return this.environmentService.getEnvironments();
  }

  fetchEnvironments(): void {
    this.environmentService.fetchEnvironments().subscribe(() => {
      console.log('environments fetched');
    });
  }

  getEnvironmentById(environmentId: string): Environment | null {
    return this.environmentService.get(environmentId);
  }

  startEnvironment(environment: Environment): void {
    console.log(environment.id);
    this.environmentService.startEnvironment(environment.id).subscribe(resp => {
      console.log(resp);
      this.openEnvironmentInBrowser(resp);
    });
  }

  openEnvironmentInBrowser(environment: Environment): void {
    const instance = environment.instance;
    const origin = this.document.location.origin;
    const url = origin + this.router.serializeUrl(
      this.router.createUrlTree(['/instance/', instance.id])
    );
    window.open(url, '_blank');
    // this.router.navigateByUrl('/instance/' + instance.id);
  }

  stopEnvironment(environment: Environment): void {
    const instance = environment.instance;
    instance.state = InstanceStates.Deleting;
    // ---- Delete data for instance-notification que.
    localStorage.removeItem(instance.name);

    this.instanceService.deleteInstance(instance.id).subscribe(_ => {
      this.fetchEnvironments();
      console.log('instance deleting process finished');
    });
  }

  filterEnvironmentsByLabels(catalogLabels, method): Environment[] {
    const environments = this.environmentService.getEnvironments();

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
    // console.log(this.selectedCatalog);
  }

  // ---- Workspace
  // ------------------------------------------------------------ //
  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  getWorkspaceById(workspaceId: string): Workspace {
    const workspaces = this.workspaceService.getUserWorkspaces();
    return workspaces.find(ws => ws.id === workspaceId);
  }
}

@Component({
  selector: 'app-join-workspace-dialog',
  templateUrl: 'join-workspace-dialog.component.html',
  styleUrls: ['./dashboard-catalog.component.scss']
})

export class JoinWorkspaceDialogComponent {

  // ---- Join Workspace Form
  joinWorkspaceForm = new FormGroup({
    joinCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9!-/:-@¥[-`{-~]*$')])
  });

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService
  ) {
  }

  get joinCode(): any {
    return this.joinWorkspaceForm.get('joinCode');
  }

  getJoinCode(): void {
    return this.joinWorkspaceForm.get('joinCode').value;
  }

  getWorkspaces(): Workspace[] {
    return this.workspaceService.getUserWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  joinWorkspace(): void {
    const code = this.joinWorkspaceForm.get('joinCode').value;
    this.workspaceService.joinWorkspace(code).subscribe(() => {
      this.joinWorkspaceForm.reset();
      this.fetchWorkspaces();
      this.environmentService.fetchEnvironments().subscribe();
    });
  }
}
