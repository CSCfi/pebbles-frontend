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
  it('should render lifetime with secondsToMinutesText()', () => {
    expect(DesktopNotificationService.secondsToMinutesText(3600)).toBe('60 min');
    expect(DesktopNotificationService.secondsToMinutesText(3600 - 31)).toBe('59 min');
    expect(DesktopNotificationService.secondsToMinutesText(3600 + 60)).toBe('1h 1m');
    expect(DesktopNotificationService.secondsToMinutesText(3600 * 2)).toBe('2h 0m');
  });

});
