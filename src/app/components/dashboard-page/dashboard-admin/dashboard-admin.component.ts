import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  public content = {
    path: 'admin',
    title: 'Admin Tool'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
