import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';
import { SystemNotificationService } from './system-notification.service';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe('SystemNotificationService', () => {
  let service: SystemNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
        MatSnackBar,
        Overlay,
      ]
    });
    service = TestBed.inject(SystemNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
