import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import { SystemNotificationService } from './system-notification.service';

describe('SystemNotificationService', () => {
  let service: SystemNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS,
        MatSnackBar,
        Overlay
      ]
    });
    service = TestBed.inject(SystemNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
