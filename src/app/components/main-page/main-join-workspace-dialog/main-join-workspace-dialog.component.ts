import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Environment } from 'src/app/models/environment';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';

@Component({
  selector: 'app-main-join-workspace-dialog',
  templateUrl: './main-join-workspace-dialog.component.html',
  styleUrls: ['./main-join-workspace-dialog.component.scss']
})
export class MainJoinWorkspaceDialogComponent implements OnInit {

  public content: any;
  public newWorkspace: Workspace;
  public environments: Environment[];

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
    return wss;
  }

  constructor(
    private workspaceService: WorkspaceService,
  ) { }

  ngOnInit(): void {
  }

  joinWorkspace(): void {
    this.workspaceService.joinWorkspace(this.joinCode).subscribe((resp) => {
      this.newWorkspace = resp;
      this.joinWorkspaceForm.reset();
      this.fetchWorkspaces();
    });
  }

  fetchWorkspaces(): void {
    this.workspaceService.fetchWorkspaces().subscribe();
  }
}
