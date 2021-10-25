import { Component, OnInit } from '@angular/core';
import { PublicConfigService } from '../../../services/public-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public publicConfigService: PublicConfigService
  ) {
  }

  ngOnInit(): void {
  }

}
