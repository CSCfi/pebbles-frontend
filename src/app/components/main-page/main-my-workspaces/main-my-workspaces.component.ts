import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from 'src/app/services/workspace.service';
// import { AuthService } from 'src/app/services/auth.service';
import { Workspace } from 'src/app/models/workspace';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Utilities } from 'src/app/utilities';

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

  public isPage = true;
  public newWorkspace: Workspace;
  queryText = '';

  // ---- Join Workspace Form
  joinWorkspaceForm = new FormGroup({
    joinCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9!-/:-@¥[-`{-~]*$')])
  });

  get isJoinCodeValid(): boolean {
    return this.joinWorkspaceForm.get('joinCode').valid;
  }

  get joinCode(): string {
    return this.joinWorkspaceForm.get('joinCode').value;
  }

  get workspaces(): Workspace[] {
    const wss = this.workspaceService.getWorkspaces().map(ws => {
      ws.name = Utilities.resetText(ws.name);
      ws.description = Utilities.resetText(ws.description);
      return ws;
    });
    return this.filterWorkspacesByText(wss, this.queryText);
  }

  constructor(
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
  ) { }


  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
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

  joinWorkspace(formDirective): void {
    this.workspaceService.joinWorkspace(this.joinCode).subscribe((resp) => {
      formDirective.resetForm(); // ---- MEMO: To avoid validation error message
      this.joinWorkspaceForm.reset();
      this.newWorkspace = resp;
      this.fetchWorkspaces();
      this.environmentService.fetchEnvironments().subscribe();
    });
  }

  getEnvironmentsByWorkspaceId(workspaceId: string) {
    return this.environmentService.getEnvironmentsByWorkspaceId(workspaceId);
  }
}
