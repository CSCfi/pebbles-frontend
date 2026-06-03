import { Component, inject, Input } from '@angular/core';
import { Data } from '@angular/router';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {
  publicConfigService = inject(PublicConfigService);


  @Input() context: Data;
}
