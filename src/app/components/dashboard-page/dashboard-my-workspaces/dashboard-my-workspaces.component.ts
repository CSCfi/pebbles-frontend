import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AuthService } from 'src/app/services/auth.service';
import { Workspace } from 'src/app/models/workspace';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-dashboard-my-workspaces',
  templateUrl: './dashboard-my-workspaces.component.html',
  styleUrls: ['./dashboard-my-workspaces.component.scss']
})
export class DashboardMyWorkspacesComponent implements OnInit {

  public isPage = true;
  public newWorkspace: Workspace;

  public content = {
    path: 'my-workspaces',
    title: 'My workspaces',
    identifier: 'my-workspace'
  };

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
    return this.workspaceService.getWorkspaces();
  }

  constructor(
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  joinWorkspace(formDirective): void {
    this.workspaceService.joinWorkspace(this.joinCode).subscribe((res) => {
      formDirective.resetForm(); // ---- MEMO: To avoid validation error message
      this.joinWorkspaceForm.reset();
      this.fetchWorkspaces();
      this.newWorkspace = res;
      this.environmentService.fetchEnvironments().subscribe();
    });
  }

  getEnvironmentsByWorkspaceId(workspaceId: string) {
    return this.environmentService.getEnvironmentsByWorkspaceId(workspaceId);
  }
}
