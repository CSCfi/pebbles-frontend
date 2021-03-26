import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() dialogTitle;
  @Input() dialogContent;
  @Input() dialog;
  public isClipboardOn = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dialogTitle: string,
      dialogContent: string,
      dialogClipboard: string
      dialogActions: string[],
    }
  ) {
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  copyText(): void {
    console.log(this.data);
  }

}
