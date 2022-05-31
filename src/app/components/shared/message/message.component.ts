import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Message, MessageType } from 'src/app/models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {

  @Input() message: Message;
  private defaultMessage = {
    isVisible: false,
    type: MessageType.Note,
    message: 'test',
    pages: [
      'catalog',
      'my-workspace',
      'workspace-owner'
    ]
  };
  public context: Data;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

  }

   ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.message = this.defaultMessage;
  }

  ngOnChanges(changes) {
    if(changes.message.currentValue){
      this.message = changes.message.currentValue;
    } else {
      this.message = this.defaultMessage;
    }
  }

  close() {
    this.message.isVisible = false;
  }
}
