import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {User} from 'src/app/models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-welcome-login',
  templateUrl: './welcome-login.component.html',
  styleUrls: ['./welcome-login.component.scss']
})
export class WelcomeLoginComponent implements OnInit {

  isLoginFormOpen = false;
  loginFormGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      eppn: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    console.log('---- onLogin');
    const eppn = this.loginFormGroup.controls.eppn.value;
    const password = this.loginFormGroup.controls.password.value;
    this.authService
      .login(eppn, password)
      .then((session) => {
        console.log(session);
        localStorage.setItem('token', btoa(session.token + ':'));
        localStorage.setItem('user_id', session.user_id);
        localStorage.setItem('user_name', eppn);
        localStorage.setItem('is_admin', session.is_admin);
        localStorage.setItem('is_workspace_owner', session.is_workspace_owner);
        localStorage.setItem('is_workspace_manager', session.is_workspace_manager);

        this.router.navigateByUrl('/dashboard').then(() => console.log('router: navigated to /dashboard'));
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
