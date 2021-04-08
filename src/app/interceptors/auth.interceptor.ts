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
    console.log('AuthInterceptor intercept ' + req.url);
    // Get the auth token from the service.
    const authToken = this.authService.getToken();

    // Clone and augment the request
    let authReq: HttpRequest<any>;
    if (authToken !== null) {
      console.log('AuthInterceptor adding auth header');
      // Update the headers with authorization.
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Basic ${authToken}`)
      });
    } else {
      authReq = req;
    }

    // Send cloned request to the next handler and handle Unauthorized 401 errors by
    // redirecting to the Front page (welcome page)
    return next.handle(authReq).pipe(
      catchError((err: Observable<HttpEvent<any>>) => {
        console.log('AuthInterceptor caught an error');
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.messageService.displayError('Authentication failed');
          this.router.navigate(['welcome']).then(() => console.log('router: navigated to welcome'));
        }
        if (err instanceof HttpErrorResponse) {
          this.messageService.displayError(`Error response from server: ${err.message}`);
        }
        throw err;
      })
    );
  }
}
