import { ApplicationRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { DesktopNotificationService } from 'src/app/services/desktop-notification.service';

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.component.html',
})
export class MainAccountComponent implements OnInit {

  user: User;
  public content = {
    path: 'account',
    title: 'Account',
    identifier: 'account'
  };

  notificationPermissionState: string = null;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private desktopNotificationService: DesktopNotificationService,
    private appRef: ApplicationRef
  ) {
  }

  ngOnInit(): void {
    this.fetchAccount();
    this.notificationPermissionState = DesktopNotificationService.getPermissionState();
  }

  fetchAccount(): void {
    const user_id = this.authService.getUserId();
    this.accountService.fetchAccount(user_id).subscribe(resp => {
      this.user = resp;
    });
  }

  isWorkspaceOwner(): boolean {
    return this.authService.isWorkspaceOwner;
  }

  getDesktopNotificationPermissionState(): string {
    return this.notificationPermissionState;
  }

  askForDesktopNotificationPermission(): void {
    this.notificationPermissionState = 'asking';
    this.desktopNotificationService.initDesktopNotification(permission => {
      this.notificationPermissionState = permission;
      this.appRef.tick();
      if (permission === 'granted') {
        console.log('permission to show notifications granted');
      }
      DesktopNotificationService.showNotification(
          'Notifications activated!', 'We will notify you of Application status changes.'
      );
    });
  }
}
