import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { onNavTextChange } from './dashboard-nav.animations';
import { AuthService } from 'src/app/services/auth.service';

// export enum DashboardPages {
//   Catalog = 'catalog',
//   Workspace = 'workspace',
//   Account = 'account',
//   Message = 'message',
//   Help = 'help',
//   WorkspaceOwnerTool = 'tool'
// }

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss'],
  animations: [onNavTextChange]
})
export class DashboardNavComponent implements OnInit {

  @Output() toggleSideNavEvent = new EventEmitter<boolean>();
  @Input() isSideNavOpen: boolean;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  emitSideNavToggle(): void {
    this.toggleSideNavEvent.emit();
  }
}
