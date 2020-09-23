import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private BASE_URL = 'http://localhost/api/v1';
  private messages: Message[] = [];
  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getMessages(): Message[] {
    return this.messages;
  }

  fetchMessages(): Observable<Message[]> {
    const url = `${this.BASE_URL}/messages`;
    return this.http.get<Message[]>(url, this.HTTP_OPTIONS).pipe(
      map(resp => {
        console.log('fetch messages got ' + resp);
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
}
