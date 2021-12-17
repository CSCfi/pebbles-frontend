import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Announcement } from 'src/app/models/announcement';
import { buildConfiguration } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private announcements: Announcement[] = [];

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {
  }

  getAnnouncements(): Announcement[] {
    return this.announcements;
  }

  fetchAnnouncements(): Observable<Announcement[]> {
    const url = `${buildConfiguration.apiUrl}/messages`;
    return this.http.get<Announcement[]>(url).pipe(
      map(resp => {
        console.log('fetch announcements got', resp);
        this.announcements = resp;
        return this.announcements.sort((a, b) =>
          new Date(b.broadcasted).getTime() - new Date(a.broadcasted).getTime());
      })
    );
  }

  displayError(s: string) {
    // limit the message to 200 chars
    s = s.substring(0, 200);
    console.log('MessageService.displayError()', s);
    this.snackbar.open(s, null, {duration: 5000});
  }

  displayResult(s: string) {
    this.snackbar.open(s, 'x', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  markAnnouncementsAsRead() {
    console.log('markAnnouncementsRead()');
    const url = `${buildConfiguration.apiUrl}/messages/${this.announcements[0].id}`;
    this.http.patch(url, {}).pipe(
      tap(_ => {
        this.fetchAnnouncements().subscribe();
      })
    ).subscribe();
  }

  getUnreadAnnouncements(): Announcement[] {
    return this.announcements.filter(a => ! a.is_read);
  }
}
