import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profile: Profile = {
    id: '1',
    email: 'admin@example.org',
    name: 'Tieteen Tietotekniikan',
    thumbnail: 'user-1.placeholder.png'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
