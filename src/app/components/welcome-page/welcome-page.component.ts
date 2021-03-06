import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  public context: Data;
  public loginFormGroup: FormGroup;
  @ViewChild('specialLoginDialog') specialLoginDialog: TemplateRef<any>;
  private dialogRef: MatDialogRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private messageService: MessageService,
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
  }

  onLogin(): void {
    const ext_id = this.loginFormGroup.controls.ext_id.value;
    const password = this.loginFormGroup.controls.password.value;
    this.authService.login(ext_id, password).pipe(
      tap(session => {
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
        if (typeof err.error === 'string') {
          this.messageService.displayError(`Login error: ${err.error}`);
        }
        throw err;
      })
    ).subscribe();
  }

  openSpecialLoginDialog(): void {
    this.dialogRef = this.dialog.open(this.specialLoginDialog, {
      height: 'auto',
      width: '400px',
      autoFocus: false
    });
  }
}
