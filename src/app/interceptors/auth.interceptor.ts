import { inject } from '@angular/core';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SystemNotificationService } from '../services/system-notification.service';
import { Utilities } from '../utilities';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const systemNotificationService = inject(SystemNotificationService);
  const router = inject(Router);

  // Get the auth token from authService
  const authToken = authService.getToken();

  // Clone and augment the request if we got a token
  let authReq: HttpRequest<any>;
  if (authToken !== null) {
    // Update the headers with authorization.
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authToken}`)
    });
  } else {
    authReq = req;
  }

  // Send cloned request to the next handler.
  // Report potential errors to user.
  // Handle Unauthorized 401 errors by redirecting to the Front page (welcome page)
  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        // figure out what to tell the user based on the fields of the response
        // In case of auth error, we navigate back to login page and let auth service do reporting
        if (err.status === 401) {
          router.navigate(['welcome']).then();
        } else if (Utilities.isApiUnreachable(err)) {
          systemNotificationService.displayError('Error: cannot connect to the API');
        } else if (typeof err.error === 'string') {
          systemNotificationService.displayError(`Error: ${err.error}`);
        } else if (err.error?.message) {
          systemNotificationService.displayError(`Error: ${err.error.message}`);
        } else if (typeof err.error?.error === 'string') {
          systemNotificationService.displayError(`Error: ${err.error.error}`);
        } else {
          systemNotificationService.displayError(`Error: ${err.statusText}`);
        }
      }
      throw err;
    })
  );
};
