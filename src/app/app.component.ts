import { Component, HostBinding } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  title = 'pebbles-frontend';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  private theme = 'user';

  @HostBinding('class')
  get themeMode() {
    return 'custom-theme-' + this.theme ;
  }

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }
}
