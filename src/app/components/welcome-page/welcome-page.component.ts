import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { PublicConfigService } from '../../services/public-config.service';
import { ServiceAnnouncementService } from '../../services/service-announcement.service';
import { SystemNotificationService } from '../../services/system-notification.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  public context: Data;

  @ViewChild('specialLoginDialogTerms') specialLoginDialogTerms: TemplateRef<any>;
  @ViewChild('processingSpecialLogin') processingSpecialLogin: TemplateRef<any>;
  @ViewChild('specialLoginDialog') specialLoginDialog: TemplateRef<any>;

  public loginClicked: boolean;
  public acceptTermsClicked: boolean;
  public loginFormGroup: UntypedFormGroup;

  readonly dialog = inject(MatDialog);
  loginError:string[] = [];

  private dialogRef: MatDialogRef<any, any>;
  private dialogRefTerms: MatDialogRef<any, any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    public publicConfigService: PublicConfigService,
    private systemNotificationService: SystemNotificationService,
    private serviceAnnouncementService: ServiceAnnouncementService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });

    this.loginFormGroup = this.formBuilder.group({
      ext_id: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // public service announcements do not need authentication, fetch them right away
    this.serviceAnnouncementService.fetchPublicServiceAnnouncements().subscribe();
  }

  onLogin(): void {
    this.loginClicked = true;
    const ext_id = this.loginFormGroup.controls.ext_id.value.trim();
    const password = this.loginFormGroup.controls.password.value.trim();
    this.authService.login(ext_id, password).pipe(
      tap(session => {
        if (!session.terms_agreed) {
          this.dialogRef.close();
          this.openSpecialLoginDialogTerms();
          return;
        }
        localStorage.setItem('token', btoa(session.token + ':'));
        localStorage.setItem('user_id', session.user_id);
        localStorage.setItem('user_name', ext_id);
        localStorage.setItem('is_admin', session.is_admin);
        localStorage.setItem('is_workspace_owner', session.is_workspace_owner);
        localStorage.setItem('is_workspace_manager', session.is_workspace_manager);
        localStorage.setItem('is_sidenav_open', 'true');

        this.dialogRef.close();
        this.router.navigateByUrl('/main').then();
      }),
      catchError(err => {
        this.loginError = [];
        // extract errors
        if (typeof err.error === 'string') {
          // strings are simple
          this.loginError.push(err.error);
          this.systemNotificationService.displayError(`Login error: ${err.error}`);
        } else {
          // the other case is 422 with a dictionary stating the errors in the form
          for(let k of Object.keys(err.error)) {
            this.loginError.push(`${k} ${err.error[k]}`);
          }
        }
        throw err;
      }),
      finalize(() => {
        this.loginClicked = false;
      }),
    ).subscribe();
  }

  onTermsAgree(): void {
    this.acceptTermsClicked = true;
    const ext_id = this.loginFormGroup.controls.ext_id.value.trim();
    const password = this.loginFormGroup.controls.password.value.trim();
    const agreement_sign: string = 'signed';
    this.authService.login(ext_id, password, agreement_sign).pipe(
      tap(session => {
        localStorage.setItem('token', btoa(session.token + ':'));
        localStorage.setItem('user_id', session.user_id);
        localStorage.setItem('user_name', ext_id);
        localStorage.setItem('is_admin', session.is_admin);
        localStorage.setItem('is_workspace_owner', session.is_workspace_owner);
        localStorage.setItem('is_workspace_manager', session.is_workspace_manager);
        localStorage.setItem('is_sidenav_open', 'true');
        this.dialogRefTerms.close();
        this.router.navigateByUrl('/main').then();
      }),
      catchError(err => {
        this.loginError = [];
        if (typeof err.error === 'string') {
          this.loginError.push(err.error);
          this.systemNotificationService.displayError(`Login error: ${err.error}`);
        }

        throw err;
      }),
      finalize(() => {
        this.acceptTermsClicked = false;
      }),
    ).subscribe();
  }

  openSpecialLoginDialog(): void {
    this.dialogRef = this.dialog.open(this.specialLoginDialog, {
      height: 'auto',
      width: '400px',
    });
  }

  openSpecialLoginDialogTerms(): void {
    this.dialogRefTerms = this.dialog.open(this.specialLoginDialogTerms, {
      height: 'auto',
      width: '480px',
    });
  }
}
