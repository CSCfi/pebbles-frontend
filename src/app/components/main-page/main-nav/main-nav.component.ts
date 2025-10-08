import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { PublicConfigService } from '../../../services/public-config.service';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  standalone: false
})
export class MainNavComponent implements OnInit {

  public isTextVisible: boolean;

  @ViewChildren('tooltip') tooltips: any;
  @ViewChild('nav-toggle-btn') el: ElementRef;

  @Output() toggleSideNavEvent = new EventEmitter<boolean>();

  @Input() set isSideNavOpen(value: boolean) {
    this.isTextVisible = value;
  }

  position = new UntypedFormControl('after');
  disabled = new UntypedFormControl(false);
  isMobileNavInvisible = true;

  get userName(): string {
    return this.authService.getUserName();
  }

  constructor(
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    public publicConfigService: PublicConfigService,
  ) {
    // fetch messages to update the nav bar unread messages number
    this.messageService.fetchMessages().subscribe();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMobileNavInvisible = true;
      }
    })
  }

  reload(link: string): void {
    this.router.navigate(['/'], {skipLocationChange: true}).then(() => {
      this.router.navigate([link]);
    });
  }

  emitSideNavToggle(): void {
    this.toggleSideNavEvent.emit();
  }

  getUnreadMessages(): Message[] {
    return this.messageService.getUnreadMessages();
  }
}
