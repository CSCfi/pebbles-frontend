import { Component, Input } from '@angular/core';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {

  @Input() isNaviVisible: boolean;
  @Input() logoTypeSize: number; // -- need?
  @Input() logoMarkSize: number;
  @Input() displayMode: string; // -- need?

  constructor(
    public publicConfigService: PublicConfigService,
  ) {
  }
}
