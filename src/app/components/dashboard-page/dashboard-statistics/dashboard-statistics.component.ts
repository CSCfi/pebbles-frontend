import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})
export class DashboardStatisticsComponent implements OnInit {

  public content = {
    path: 'statistics',
    title: 'Statistics',
    identifier: 'statistics'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
