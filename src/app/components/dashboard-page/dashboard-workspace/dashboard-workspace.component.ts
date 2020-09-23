import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AuthService } from 'src/app/services/auth.service';
import { Workspace } from 'src/app/models/workspace';

@Component({
  selector: 'app-dashboard-workspace',
  templateUrl: './dashboard-workspace.component.html',
  styleUrls: ['./dashboard-workspace.component.scss']
})

export class DashboardWorkspaceComponent implements OnInit {

  // ---- Join Workspace Form
  joinWorkspaceForm = new FormGroup({
    joinCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9!-/:-@¥[-`{-~]*$')])
  });

  constructor(
    private workspaceService: WorkspaceService,
    private authService: AuthService,
  ) {}

  get joinCode(): any {
    return this.joinWorkspaceForm.get('joinCode');
  }

  ngOnInit(): void {
    this.fetchWorkspaces();
  }

  getWorkspaces(): Workspace[] {
    return this.workspaceService.getWorkspaces();
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe(() => {
      console.log('workspaces fetched');
    });
  }

  joinWorkspace(formDirective): void {
    const joinCode = this.joinWorkspaceForm.get('joinCode').value;
    this.workspaceService.joinWorkspace(joinCode).subscribe(() => {
      formDirective.resetForm(); // ---- MEMO: To avoid validation error message
      this.joinWorkspaceForm.reset();
      this.fetchWorkspaces();
    });
  }

  exitWorkspace(workspaceId: string): void {
    if (!confirm('Are you sure ?')) {
      return;
    }
    this.workspaceService.exitWorkspace(workspaceId).subscribe(() => {
      this.fetchWorkspaces();
    });
  }

  getUserName(): string {
    return this.authService.getUserName();
  }

  isOwner(workspace: Workspace): boolean{
    return workspace.owner_eppn === this.getUserName();
  }

  // deleteWorkspace(workspaceId: string): void {
  //   this.workspaceService.deleteWorkspace(workspaceId).subscribe(() => {
  //     this.fetchWorkspaces();
  //   });
  // }

}
