import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-help',
  templateUrl: './dashboard-help.component.html',
  styleUrls: ['./dashboard-help.component.scss']
})
export class DashboardHelpComponent implements OnInit {

  public content = {
    path: 'help',
    title: 'Help',
    identifier: 'help'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
