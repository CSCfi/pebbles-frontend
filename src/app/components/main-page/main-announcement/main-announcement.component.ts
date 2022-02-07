import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Announcement } from 'src/app/models/announcement';

@Component({
  selector: 'app-main-announcement',
  templateUrl: './main-announcement.component.html',
  styleUrls: ['./main-announcement.component.scss']
})
export class MainAnnouncementComponent implements OnInit {

  public content = {
    path: 'announcements',
    title: 'Announcements',
    identifier: 'announcements'
  };

  get isAllRead() {
    return this.announcements.filter( item => !item.is_read ).length === 0;
  }

  get announcements(): Announcement[] {
    return this.messageService.getAnnouncements();
  }

  constructor(
    public messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.fetchAnnouncements();
  }

  getAnnouncements(): Announcement[] {
    return this.messageService.getAnnouncements();
  }

  fetchAnnouncements(): void {
    this.messageService.fetchAnnouncements().subscribe();
  }

  formatDate(dateStr: string): string {
    // window.navigator.language should be covered well in modern browsers
    // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
    return new Date(dateStr).toLocaleString(
      window.navigator.language ? window.navigator.language : 'en-gb'
    );
  }

  markAnnouncementsAsRead() {
    this.messageService.markAnnouncementsAsRead();
  }
}
