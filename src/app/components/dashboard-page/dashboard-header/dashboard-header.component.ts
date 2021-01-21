import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Announcement } from 'src/app/models/announcement';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})

export class DashboardHeaderComponent implements OnInit {

  user: User;

  constructor(
    public authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }
}
