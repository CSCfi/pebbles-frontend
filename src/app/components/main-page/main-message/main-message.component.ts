import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';
import { Utilities } from '../../../utilities';

@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss'],
  standalone: false
})
export class MainMessageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);


  public context: Data;

  get isAllRead() {
    return this.messages.filter(item => !item.is_read).length === 0;
  }

  get messages(): Message[] {
    return this.messageService.getMessages();
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
