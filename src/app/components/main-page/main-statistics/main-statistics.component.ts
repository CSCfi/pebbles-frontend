import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-main-statistics',
  templateUrl: './main-statistics.component.html',
  styleUrls: ['./main-statistics.component.scss']
})
export class MainStatisticsComponent implements OnInit {

  public context: Data;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
  }

}
