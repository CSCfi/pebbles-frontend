export enum NotificationType {
    Alert = 'alert',
    Notice = 'notice',
    Error = 'error',
}

export class Notification {
  constructor(
    public id: string,
    public broadcasted: string,
    public subject: string,
    public message: string,
    public type?: NotificationType
    ) {
  }
}
