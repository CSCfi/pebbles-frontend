import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-help-nav',
  templateUrl: './main-help-nav.component.html',
  styleUrls: ['./main-help-nav.component.scss']
})
export class MainHelpNavComponent implements OnInit {

  public activeTopic = 'faq';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe(_ => {
      if (this.route.snapshot.firstChild) {
      this.activeTopic = this.route.snapshot.firstChild.routeConfig.path;
      }
    });
  }

  ngOnInit(): void {

  }
}
