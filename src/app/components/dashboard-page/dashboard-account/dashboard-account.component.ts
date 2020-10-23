import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.component.html',
  styleUrls: ['./dashboard-account.component.scss']
})
export class DashboardAccountComponent implements OnInit {

  user: User = new User();
  public content = {
    path: 'account',
    title: 'Account Setting'
  };

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.fetchAccount();
  }


  fetchAccount(): void {
    const user_id = this.authService.getUserId();
    this.accountService.fetchAccount(user_id).subscribe(resp => {
      this.user = resp;
    });
  }

}
