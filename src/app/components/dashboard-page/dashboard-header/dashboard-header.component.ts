import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})

export class DashboardHeaderComponent implements OnInit {

  user: User;
  @Input() styleOption: number;

  constructor(
    public authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  getMessages(): Message[] {
    return this.messageService.getMessages().filter(msg => msg.is_checked === false);
  }
}
