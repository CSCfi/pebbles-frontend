import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-main-mobile-nav',
  templateUrl: './main-mobile-nav.component.html',
  styleUrls: ['./main-mobile-nav.component.scss'],
  standalone: false
})
export class MainMobileNavComponent implements OnInit {

  isMobileNavInvisible = true;

  get userName(): string {
    return this.authService.getUserName();
  }

  constructor(
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMobileNavInvisible = true;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMobileNavInvisible) return;
    if (this.elementRef.nativeElement.contains(event.target as Node)) return;
    this.isMobileNavInvisible = true;
  }

  getUnreadMessages(): Message[] {
    return this.messageService.getUnreadMessages();
  }
}
