import { Component, Input } from '@angular/core';
import { Data } from '@angular/router';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {

  @Input() context: Data;

  constructor(
    public publicConfigService: PublicConfigService
  ) {
  }
}
