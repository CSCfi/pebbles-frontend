import { Component, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Announcement } from '../../../models/announcement';
import { MessageService } from '../../../services/message.service';
import { ApplicationSessionService } from '../../../services/application-session.service';
import { PublicConfigService } from '../../../services/public-config.service';

// export enum MainPages {
//   Catalog = 'catalog',
//   Workspace = 'workspace',
//   Account = 'account',
//   Message = 'message',
//   Help = 'help',
//   WorkspaceOwnerTool = 'tool'
// }

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  public isTextVisible: boolean;
  public faChevronRightIcon = faChevronRight;
  public faChevronLeftIcon = faChevronLeft;

  @ViewChildren('tooltip') tooltips: any;
  @Output() toggleSideNavEvent = new EventEmitter<boolean>();

  @Input() set isSideNavOpen(value: boolean) {
    this.isTextVisible = value;
    this.toggleToolTips(value);
  }

  position = new FormControl('after');
  disabled = new FormControl(false);

  get userName(): string {
    return this.authService.getUserName();
  }

  constructor(
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    public applicationSessionService: ApplicationSessionService,
    public publicConfigService: PublicConfigService,
  ) {
    // fetch announcements to update the nav bar unread announcements number
    this.messageService.fetchAnnouncements().subscribe();
  }

  reload(link: string): void {
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => { this.router.navigate([link]); });
  }

  emitSideNavToggle(): void {
    this.toggleSideNavEvent.emit();
  }

  toggleToolTips(value): void {
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

  logout(): void {
    if (!confirm('Are you sure to logout from Notebooks?')) {
      return;
    }
    this.authService.logout();
    this.applicationSessionService.clearPollingInterval();
  }
}
