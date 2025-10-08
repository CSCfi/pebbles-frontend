import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss'],
  standalone: false
})
export class MainMessageComponent implements OnInit {

  public context: Data;

  get isAllRead() {
    return this.messages.filter( item => !item.is_read ).length === 0;
  }

  get messages(): Message[] {
    return this.messageService.getMessages();
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
    this.fetchMessages();
  }

  getMessages(): Message[] {
    return this.messageService.getMessages();
  }

  fetchMessages(): void {
    this.messageService.fetchMessages().subscribe();
  }

  markMessagesAsRead() {
    this.messageService.markMessagesAsRead();
  }

  getIsoToTimestamp(broadcasted: string) {
    return Utilities.getIsoToTimestamp(broadcasted);
  }
}
