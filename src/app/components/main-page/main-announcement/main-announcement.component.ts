import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Announcement } from 'src/app/models/announcement';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-announcement',
  templateUrl: './main-announcement.component.html',
  styleUrls: ['./main-announcement.component.scss']
})
export class MainAnnouncementComponent implements OnInit {

  public context: Data;

  get isAllRead() {
    return this.announcements.filter( item => !item.is_read ).length === 0;
  }

  get announcements(): Announcement[] {
    return this.messageService.getAnnouncements();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.fetchAnnouncements();
  }

  getAnnouncements(): Announcement[] {
    return this.messageService.getAnnouncements();
  }

  fetchAnnouncements(): void {
    this.messageService.fetchAnnouncements().subscribe();
  }

  markAnnouncementsAsRead() {
    this.messageService.markAnnouncementsAsRead();
  }

  getIsoToTimestamp(broadcasted: string) {
    return Utilities.getIsoToTimestamp(broadcasted);
  }
}
