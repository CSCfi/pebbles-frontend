import { TestBed } from '@angular/core/testing';

import { DesktopNotificationService } from './desktop-notification.service';

describe('DesktopNotificationService', () => {
  let service: DesktopNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
