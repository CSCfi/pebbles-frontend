import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
export class MainNavComponent {
  router = inject(Router);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  publicConfigService = inject(PublicConfigService);


  public isTextVisible: boolean;

  @ViewChildren('tooltip') tooltips: any;
  @ViewChild('nav-toggle-btn') el: ElementRef;

  @Output() toggleSideNavEvent = new EventEmitter<boolean>();

  @Input() set isSideNavOpen(value: boolean) {
    this.isTextVisible = value;
  }

  position = new UntypedFormControl('after');
  disabled = new UntypedFormControl(false);

  get userName(): string {
    return this.authService.getUserName();
  }

  constructor() {
    // fetch messages to update the nav bar unread messages number
    this.messageService.fetchMessages().subscribe();
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
