import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.scss']
})
export class MainAdminComponent implements OnInit {

  public content = {
    path: 'admin',
    title: 'Admin tool',
    identifier: 'admin-tool'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
