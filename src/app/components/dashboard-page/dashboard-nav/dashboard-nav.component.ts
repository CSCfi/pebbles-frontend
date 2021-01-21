import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';
import {Announcement} from '../../../models/announcement';
import {MessageService} from '../../../services/message.service';

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
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {

  public isTextVisible: boolean;
  @ViewChildren('tooltip') tooltips;
  @Output() toggleSideNavEvent = new EventEmitter<boolean>();

  @Input() set isSideNavOpen(value: boolean) {
    this.isTextVisible = value;
    this.toggleToolTips(value);
  }

  position = new FormControl('after');
  disabled = new FormControl(false);

  constructor(
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
  ) {
    // fetch announcements to update the nav bar unread announcements number
    this.messageService.fetchAnnouncements().subscribe();
  }

  ngOnInit(): void {
  }

  emitSideNavToggle(): void {
    this.toggleSideNavEvent.emit();
  }

  toggleToolTips(value) {
    if (!this.tooltips) {
      return;
    }
    if (value) {
      this.tooltips._results.forEach(item => item.disabled = true);
    } else {
      this.tooltips._results.forEach(item => {
        item.disabled = false;
        item.position = 'right';
      });
    }
  }

  getUnreadAnnouncements(): Announcement[] {
    return this.messageService.getUnreadAnnouncements();
  }
}
