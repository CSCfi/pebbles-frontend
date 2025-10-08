import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data } from '@angular/router';
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
  animations: [heroShotsAnimation],
  standalone: false
})
export class WelcomeLoginComponent implements OnInit {

  images: boolean[] = [true, false, false];
  isImageVisible0 = false;
  isImageVisible1 = false;
  isImageVisible2 = false;

  @Input() context: Data;
  @Output() emitSpecialLogin = new EventEmitter<boolean>();

  constructor(
    public publicConfigService: PublicConfigService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isImageVisible0 = true;
    }, 300);
    // ---- MEMO:  Copy is needed by spread operator, to change the identifier for serviceAnnouncement.
    this.context = { ... this.context };
    this.context.identifier = 'login';
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
