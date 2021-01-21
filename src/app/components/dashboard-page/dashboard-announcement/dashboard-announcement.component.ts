import {Component, OnInit} from '@angular/core';
import {MessageService} from 'src/app/services/message.service';
import {Announcement} from 'src/app/models/announcement';

@Component({
  selector: 'app-dashboard-announcement',
  templateUrl: './dashboard-announcement.component.html',
  styleUrls: ['./dashboard-announcement.component.scss']
})
export class DashboardAnnouncementComponent implements OnInit {

  public content = {
    path: 'announcements',
    title: 'Announcements'
  };

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
    this.messageService.fetchAnnouncements().subscribe(() => {
      console.log('message fetched');
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toISOString();
  }

  markAnnouncementsAsRead() {
    this.messageService.markAnnouncementsAsRead();
  }
}
