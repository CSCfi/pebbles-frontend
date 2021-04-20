import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.component.html',
  styleUrls: ['./main-account.component.scss']
})
export class MainAccountComponent implements OnInit {

  user: User;
  public content = {
    path: 'account',
    title: 'Account',
    identifier: 'account'
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

  is_workspace_owner() {
    return this.authService.isWorkspaceOwner;
  }
}
