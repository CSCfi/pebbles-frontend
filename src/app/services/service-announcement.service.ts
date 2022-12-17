import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { ServiceAnnouncement } from '../models/service-announcement';

@Injectable({
  providedIn: 'root'
})
export class ServiceAnnouncementService {

  private serviceAnnouncements: ServiceAnnouncement[] = [];

  constructor(
    private http: HttpClient
  ) {}

  getServiceAnnouncements(): ServiceAnnouncement[] {
    return this.serviceAnnouncements;
  }

  fetchServiceAnnouncements(): Observable<ServiceAnnouncement[]> {
    const url = `${buildConfiguration.apiUrl}/service_announcements`;
    return this.http.get<ServiceAnnouncement[]>(url).pipe(
      map(resp => {
        this.serviceAnnouncements = this.serviceAnnouncements = resp.filter(item => item.is_enabled);
        return this.serviceAnnouncements;
      })
    );
  }
}
