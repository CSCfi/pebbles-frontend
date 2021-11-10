import { Injectable } from '@angular/core';
import { ApplicationSession, SessionLifetimeLevel, SessionStates } from 'src/app/models/application-session';

@Injectable({
  providedIn: 'root'
})
export class DesktopNotificationService {

  static showNotification(notificationTitle: string, notificationBody?: string): void {
    const options = {
      body: notificationBody,
      autoClose: 10000
    };
    const notification = new Notification(notificationTitle, options);
    console.log('displayed notification "' + notification.title + '"');
  }

  static getPermissionState(): string {
    // no notification support, return 'denied'
    if (!('Notification' in window)) {
      return null;
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/notification
    // possible values are 'granted', 'denied', 'default'
    return Notification.permission;
  }

  static secondsToMinutesText(secs: number): string {
    const mins = Math.round(secs / 60);
    if (mins > 60) {
      const hours = mins / 60;
      const rem_mins = mins - (hours * 60);
      return `${hours}h ${rem_mins}m`;
    } else {
      return `${mins} min`;
    }
  }

  // ---- Asks permission for desktop notifications
  public initDesktopNotification(callback: NotificationPermissionCallback): void {
    try {
      // first try the deprecated version that works also on Safari
      Notification.requestPermission(callback);
    }
    catch (error) {
      // if the browser does not accept the deprecated callback as an argument, try the new Promise based version
      Notification.requestPermission().then(callback);
    }
  }

  public notifySessionLifetime(sessions: ApplicationSession[]): void {

    // only try to show notifications if we have the permission to do so
    if (DesktopNotificationService.getPermissionState() !== 'granted') {
      return;
    }

    // get the notifications already sent for all sessions
    let notification_states: {} = JSON.parse(localStorage.getItem('notification_states'));
    if (!notification_states) {
      notification_states = {};
    }

    for (const session of sessions) {
      // sent notifications for this session
      let sent_notifications: string[] = notification_states[session.name];
      if (!sent_notifications) {
        sent_notifications = [];
      }
      switch (session.state) {
        case SessionStates.Running:
          // ---- Notify when the session is ready.
          if (!sent_notifications.includes(SessionLifetimeLevel.Full)) {
            DesktopNotificationService.showNotification(
              'Your Environment is now running',
              'Total time left is ' + DesktopNotificationService.secondsToMinutesText(session.lifetime_left)
            );
            sent_notifications.push(SessionLifetimeLevel.Full);
          }
          // ---- Warn when the end is nigh.
          else if (session.lifetime_left < 900 && !sent_notifications.includes(SessionLifetimeLevel.Short)) {
            DesktopNotificationService.showNotification(
              'Environment expiring in ' + DesktopNotificationService.secondsToMinutesText(session.lifetime_left),
              'Any unsaved data will be lost.'
            );
            sent_notifications.push(SessionLifetimeLevel.Short);
          } else if (session.lifetime_left < 300 && !sent_notifications.includes(SessionLifetimeLevel.Dying)) {
            DesktopNotificationService.showNotification(
              'Environment expiring in ' + DesktopNotificationService.secondsToMinutesText(session.lifetime_left),
              'Any unsaved data will be lost.'
            );
            sent_notifications.push(SessionLifetimeLevel.Dying);
          }
          break;
        case SessionStates.Deleted:
          localStorage.removeItem(session.name);
          break;
        case SessionStates.Failed:
          if (!sent_notifications.includes(SessionLifetimeLevel.Failed)) {
            // ---- Notify when the starting a session failed
            DesktopNotificationService.showNotification(
              `Error! Your Environment failed to be provisioned.`,
              'Please try again in a moment. If the error persists, contact support.'
            );
            sent_notifications.push(SessionLifetimeLevel.Failed);
          }
          break;
        default:
          console.log(session.state, DesktopNotificationService.secondsToMinutesText(session.lifetime_left));
      }
      notification_states[session.name] = sent_notifications;
      localStorage.setItem('notification_states', JSON.stringify(notification_states));
    }
  }
}
