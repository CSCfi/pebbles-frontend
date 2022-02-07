import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from authService
    const authToken = this.authService.getToken();

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
    return next.handle(authReq).pipe(
      catchError((err: Observable<HttpEvent<any>>) => {
        if (err instanceof HttpErrorResponse) {
          // figure out what to tell the user based on the fields of the response
          // In case of auth error, we navigate back to login page and let auth service do reporting
          if (err.status === 401) {
            this.router.navigate(['welcome']).then();
          } else if (err.status === 0 || err.status === 503) {
            // if we can't connect at all, we'll get 0. If ingress/route can't respond, we'll get 503
            this.messageService.displayError('Error: cannot connect to the API');
          } else if (typeof err.error === 'string') {
            this.messageService.displayError(`Error: ${err.error}`);
          } else if (err.error?.message) {
            this.messageService.displayError(`Error: ${err.error.message}`);
          } else {
            this.messageService.displayError(`Error: ${err.statusText}`);
          }
        }
        throw err;
      })
    );
  }
}
