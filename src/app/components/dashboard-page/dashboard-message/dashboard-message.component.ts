import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
// import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-dashboard-message',
  templateUrl: './dashboard-message.component.html',
  styleUrls: ['./dashboard-message.component.scss']
})
export class DashboardMessageComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchMessages();
  }

  getMessages(): Message[] {
    return this.messageService.getMessages();
  }

  fetchMessages(): void {
    this.messageService.fetchMessages().subscribe(() => {
      console.log('message fetched');
    });
  }
}
