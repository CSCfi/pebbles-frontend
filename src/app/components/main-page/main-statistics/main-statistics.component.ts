import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-statistics',
  templateUrl: './main-statistics.component.html',
  styleUrls: ['./main-statistics.component.scss']
})
export class MainStatisticsComponent implements OnInit {

  public content = {
    path: 'statistics',
    title: 'Statistics',
    identifier: 'statistics'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
