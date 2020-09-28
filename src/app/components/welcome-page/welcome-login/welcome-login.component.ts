import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-welcome-login',
  templateUrl: './welcome-login.component.html',
  styleUrls: ['./welcome-login.component.scss']
})
export class WelcomeLoginComponent implements OnInit {

  user: User = new User();
  isLoginFormOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ){ }

  ngOnInit(): void {
  }

  onLogin(): void {
    console.log('---- onLogin');
    this.authService
      .login(this.user)
      .then((session) => {
        console.log(session);
        localStorage.setItem('token', btoa(session.token + ':'));
        localStorage.setItem('user_id', session.user_id);
        localStorage.setItem('user_name', this.user.eppn);
        localStorage.setItem('is_admin', session.is_admin);
        localStorage.setItem('is_workspace_owner', session.is_group_owner);
        localStorage.setItem('is_workspace_manager', session.is_workspace_manager);

        this.router.navigateByUrl('/dashboard').then(() => console.log('router: navigated to /dashboard'));
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
