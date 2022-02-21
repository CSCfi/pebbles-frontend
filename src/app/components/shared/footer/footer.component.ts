import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data } from '@angular/router';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() context: Data;
  @Output() emitSpecialLogin = new EventEmitter<boolean>();

  constructor(
    public publicConfigService: PublicConfigService
  ) {
  }

  ngOnInit(): void {
  }

  openSpecialLogin() {
    this.emitSpecialLogin.emit();
  }
}
