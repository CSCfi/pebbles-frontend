import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchMessages();
  }

  getImportantMessages(): Message[] {
    return this.messageService.getMessages().filter(msg =>
      msg.is_checked === false && msg.is_important === true
      );
  }

  fetchMessages(): void {
    this.messageService.fetchMessages().subscribe(() => {
      console.log('Messages fetched');
    });
  }

  hideMessage() {
    // ---- change message.data : message.is_checked: true
  }
}
