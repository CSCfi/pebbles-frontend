import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-breadcrumb',
  templateUrl: './dashboard-breadcrumb.component.html',
  styleUrls: ['./dashboard-breadcrumb.component.scss']
})
export class DashboardBreadcrumbComponent implements OnInit {

  @Input() content: any;
  breadcrumbs: string[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(d => {
      this.breadcrumbs = d.breadcrumbs;
    });
  }
}
