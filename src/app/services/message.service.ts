import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        console.log('fetch messages got', resp);
        this.messages = resp;
        for (const msg of this.messages) {
          const date = new Date(msg.broadcasted);
          msg.date = date.toDateString();
          msg.is_important = msg.is_important === true;
          msg.is_checked = msg.is_checked !== false;
        }
        return this.messages.sort((a, b) => new Date(b.broadcasted).getTime() - new Date(a.broadcasted).getTime());
      })
    );
  }

  displayError(s: string) {
    console.log('MessageService.displayError()', s);
    this.snackbar.open(s, null, {duration: 5000});
  }
}
