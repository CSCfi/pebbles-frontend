import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { DesktopNotificationService } from 'src/app/services/desktop-notification.service';
import { PublicConfigService } from "../../../services/public-config.service";

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.component.html',
  styleUrls: ['./main-account.component.scss'],
  standalone: false
})
export class MainAccountComponent implements OnInit {

  public context: Data;
  public user: User;
  public notificationPermissionState: string = null;

  constructor(
    private appRef: ApplicationRef,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService,
    private desktopNotificationService: DesktopNotificationService,
    private publicConfigService: PublicConfigService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
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
      DesktopNotificationService.showNotification(
        'Notifications activated!', 'We will notify you of Application status changes.'
      );
    });
  }

  requestAccountDeletion(): void {
    if (confirm(`Are you sure you want your account "${this.user.ext_id}" deleted?`)) {
      this.accountService.requestAccountDeletion(this.authService.getUserId()).subscribe(resp => {
        this.user = resp;
      });
    }
  }

  isAccountDeletionRequested(): boolean {
    return this.user?.deletion_requested_date != null;
  }

  getContactEmail(): string {
    return this.publicConfigService.getContactEmail()
  }
}
