import { Notification, NotificationType } from './notification';

describe('Notification', () => {
  it('should create an notification', () => {
    expect(new Notification('0', 'notefication test', 'Sep 11 2020', NotificationType.Notice)).toBeTruthy();
  });
});
