import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
import { buildConfiguration } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {
  }

  getMessages(): Message[] {
    return this.messages;
  }

  fetchMessages(): Observable<Message[]> {
    const url = `${buildConfiguration.apiUrl}/messages`;
    return this.http.get<Message[]>(url).pipe(
      map(resp => {
        this.messages = resp;
        return this.messages.sort((a, b) =>
          new Date(b.broadcasted).getTime() - new Date(a.broadcasted).getTime());
      })
    );
  }

  displayError(s: string) {
    // limit the message to 200 chars
    s = s.substring(0, 200);
    this.snackbar.open(s, null, {duration: 5000});
  }

  displayResult(s: string) {
    this.snackbar.open(s, 'x', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  markMessagesAsRead() {
    const url = `${buildConfiguration.apiUrl}/messages/${this.messages[0].id}`;
    this.http.patch(url, {}).pipe(
      tap(_ => {
        this.fetchMessages().subscribe();
      })
    ).subscribe();
  }

  getUnreadMessages(): Message[] {
    return this.messages.filter(a => ! a.is_read);
  }
}
