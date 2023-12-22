import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  displayError(s: string) {
    // limit the message to 200 chars
    s = s.substring(0, 200);
    this.snackbar.open(s, null, {duration: 8000});
  }

  displayResult(s: string) {
    this.snackbar.open(s, 'x', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

}
