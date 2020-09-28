import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';

export enum DashboardPages {
  Catalog = 'catalog',
  Workspace = 'workspace',
  Account = 'account',
  Message = 'message',
  Help = 'help',
  WorkspaceOwnerTool = 'tool'
}

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {

  @Output() sendValue: EventEmitter<{ value: string }> = new EventEmitter<{ value: string }>();

  get isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true' ? true : false;
  }

  get isWorkspaceOwner(): boolean {
    return localStorage.getItem('is_workspace_owner') === 'true' ? true : false;
  }

  get isWorkspaceManager(): boolean {
    return localStorage.getItem('is_workspace_manager') === 'true' ? true : false;
  }

  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {
  }

  sidenavToggle(): void {
    this.sendValue.emit({ value: 'hoge' });
  }
}
