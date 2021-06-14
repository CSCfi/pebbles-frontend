import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-help-contact',
  templateUrl: './main-help-contact.component.html',
  styleUrls: ['./main-help-contact.component.scss']
})
export class MainHelpContactComponent implements OnInit {
  public content = {
    path: 'help/contact',
    title: 'Help:Contact',
    identifier: 'help-contact'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
