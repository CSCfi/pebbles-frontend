import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PublicConfigService } from '../../../services/public-config.service';

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
  animations: [heroShotsAnimation]
})
export class WelcomeLoginComponent implements OnInit {

  images: boolean[] = [true, false, false];
  isImageVisible0 = false;
  isImageVisible1 = false;
  isImageVisible2 = false;

  @Output() emitSpecialLogin = new EventEmitter<boolean>();

  constructor(
    public publicConfigService: PublicConfigService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isImageVisible0 = true;
    }, 300);
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
  openSpecialLogin() {
    this.emitSpecialLogin.emit();
  }
}
