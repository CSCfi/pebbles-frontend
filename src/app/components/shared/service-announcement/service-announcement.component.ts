import { Component, Input } from '@angular/core';
import { Data } from '@angular/router';
import { ServiceAnnouncement } from '../../../models/service-announcement';
import { EventService } from '../../../services/event.service';
import { ServiceAnnouncementService } from '../../../services/service-announcement.service';

@Component({
  selector: 'app-service-announcement',
  templateUrl: './service-announcement.component.html',
  styleUrls: ['./service-announcement.component.scss']
})
export class ServiceAnnouncementComponent {

  @Input() context: Data;

  public serviceAnnouncements: ServiceAnnouncement[];

  constructor(
    private eventService: EventService,
    private serviceAnnouncementService: ServiceAnnouncementService
  ) {
  }

  getServiceAnnouncements(): ServiceAnnouncement[] {
    this.serviceAnnouncements = this.serviceAnnouncementService.getServiceAnnouncements();

    return this.serviceAnnouncements.filter(item => {
      const targets = item.targets.split(',').map(item => item.trim());
      if (['welcome', 'login'].includes(this.context.identifier)) {
        return targets.includes(this.context.identifier) && item.is_public;
      } else {
        return targets.includes(this.context.identifier);
      }
    });
  }

  getServiceAnnouncementType(level: number): string {
    let itemStyle;

    switch (level) {
      case 5:
        itemStyle = 'critical';
        break;
      case 4:
        itemStyle = 'important';
        break;
      case 3:
        itemStyle = 'moderate';
        break;
      case 2:
        itemStyle = 'general';
        break;
      case 1:
      default:
        itemStyle = 'default';
        break;
    }
    return itemStyle;
  }
}
