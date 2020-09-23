import { Component, OnInit } from '@angular/core';
import { db } from 'src/app/interceptors/test-data';
import { Profile } from 'src/app/models/profile';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.component.html',
  styleUrls: ['./dashboard-account.component.scss']
})
export class DashboardAccountComponent implements OnInit {

  profile: Profile = db.profiles[0];

  constructor() { }

  ngOnInit(): void {
    console.log(this.profile);
  }

}
