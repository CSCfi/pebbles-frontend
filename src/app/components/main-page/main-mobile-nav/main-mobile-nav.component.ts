import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-main-mobile-nav',
  templateUrl: './main-mobile-nav.component.html',
  styleUrls: ['./main-mobile-nav.component.scss'],
  standalone: false
})
export class MainMobileNavComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  publicConfigService = inject(PublicConfigService);
  pageTitle = '';
  isMobileNavInvisible = true;

  private elementRef = inject(ElementRef);
  private activatedRoute = inject(ActivatedRoute);

  get userName(): string {
    return this.authService.getUserName();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMobileNavInvisible = true;
        this.updatePageTitle();
      }
    });
  }

  private updatePageTitle(): void {
    let route = this.activatedRoute.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.pageTitle = route.data['title'] ?? '';
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
