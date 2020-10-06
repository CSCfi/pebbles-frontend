import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AuthService } from 'src/app/services/auth.service';
import { Workspace } from 'src/app/models/workspace';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-dashboard-workspace',
  templateUrl: './dashboard-workspace.component.html',
  styleUrls: ['./dashboard-workspace.component.scss']
})
export class DashboardWorkspaceComponent implements OnInit {

  public content = {
    path: 'user-workspace',
    title: 'Joined Workspace'
  };

  // ---- Join Workspace Form
  joinWorkspaceForm = new FormGroup({
    joinCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9!-/:-@¥[-`{-~]*$')])
  });

  constructor(
    private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService,
    private authService: AuthService,
  ) {}

  get joinCode(): any {
    return this.joinWorkspaceForm.get('joinCode');
  }

  get workspaces(): Workspace[] {
    return this.workspaceService.getUserWorkspaces();
  }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchUserWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  joinWorkspace(formDirective): void {
    const code = this.joinWorkspaceForm.get('joinCode').value;
    this.workspaceService.joinWorkspace(code).subscribe(() => {
      formDirective.resetForm(); // ---- MEMO: To avoid validation error message
      this.joinWorkspaceForm.reset();
      this.fetchWorkspaces();
    });
  }

  getEnvironmentsByWorkspaceId(workspaceId: string) {
    return this.environmentService.getEnvironmentsByWorkspaceId(workspaceId);
  }

  // isOwner(workspace: Workspace): boolean{
    // return workspace.owner_eppn === this.authService.getUserName();
  // }

  // deleteWorkspace(workspaceId: string): void {
  //   this.workspaceService.deleteWorkspace(workspaceId).subscribe(() => {
  //     this.fetchWorkspaces();
  //   });
  // }

}
