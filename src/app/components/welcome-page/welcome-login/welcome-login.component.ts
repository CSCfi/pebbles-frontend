import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {User} from 'src/app/models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {trigger, state, style, animate, transition} from '@angular/animations';

export const heroShotsAnimation = trigger('openClose', [
  state('open', style({
      opacity: 1
    })),
  state('closed', style({
      opacity: 0
    })),
  transition('open => closed', [
      animate('0.5s')
    ]),
  transition('closed => open', [
      animate('1s')
    ]),
]);

@Component({
  selector: 'app-welcome-login',
  templateUrl: './welcome-login.component.html',
  styleUrls: ['./welcome-login.component.scss'],
  animations: [ heroShotsAnimation ]
})
export class WelcomeLoginComponent implements OnInit {

  isLoginFormOpen = false;
  loginFormGroup: FormGroup;
  images: boolean[] = [true, false, false];
  isImageVisible0 = false;
  isImageVisible1 = false;
  isImageVisible2 = false;

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
    setTimeout(() => { this.isImageVisible0 = true; }, 300);
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

  onImageShow(index): void {

    switch (index) {
      case 0:
        this.isImageVisible0 = true;
        this.isImageVisible1 = false;
        this.isImageVisible2 = false;
        break;
      case 1:
        this.isImageVisible0 = false;
        this.isImageVisible1 = true;
        this.isImageVisible2 = false;
        break;
      case 2:
        this.isImageVisible0 = false;
        this.isImageVisible1 = false;
        this.isImageVisible2 = true;
        break;
      default:
        break;
    }
    // ---- hero-shots animation doesn't work with the approach below
    // let images = [false,false,false];
    // this.images = images.map(
    //     (value, i) => i === index ? true : false
    // );
  }
}
