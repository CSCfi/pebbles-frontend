import { Component, inject, Input } from '@angular/core';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  publicConfigService = inject(PublicConfigService);


  @Input() isNaviVisible: boolean;
  @Input() logoTypeSize: number; // -- need?
  @Input() logoMarkSize: number;
  @Input() displayMode: string;
}
