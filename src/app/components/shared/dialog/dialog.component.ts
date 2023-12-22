import { Component, Inject, Input } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() dialogTitle: string;
  @Input() dialogContent: string;
  @Input() dialog: any; // ---- TODO: Check we need it or not

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

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
