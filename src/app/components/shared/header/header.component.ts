import { Component, Input } from '@angular/core';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() isNaviVisible: boolean;
  @Input() logoTypeSize: number;
  @Input() logoMarkSize: number;
  @Input() displayMode: string;

  constructor(
    public publicConfigService: PublicConfigService,
  ) {
  }
}
