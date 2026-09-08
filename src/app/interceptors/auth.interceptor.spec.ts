import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { SystemNotificationService } from "../services/system-notification.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Overlay } from "@angular/cdk/overlay";
import { RouterModule } from "@angular/router";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      providers: [
        MatSnackBar,
        Overlay,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ]
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should notify the user about a failure', () => {
    const displayError = spyOn(TestBed.inject(SystemNotificationService), 'displayError');

    TestBed.inject(HttpClient).get('api/v1/workspaces').subscribe({error: () => undefined});
    TestBed.inject(HttpTestingController).expectOne('api/v1/workspaces')
      .flush('', {status: 503, statusText: 'Service Unavailable'});

    expect(displayError).toHaveBeenCalledWith('Error: cannot connect to the API');
  });
});
