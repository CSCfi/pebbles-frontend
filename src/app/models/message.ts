export enum MessageType {
  Default = 'default',
  Note = 'note',
  Success = 'success',
  Warning = 'warning',
}

export interface Message {
  isVisible: boolean;
  type?: MessageType;
  description?: string;
  pages?: string[];
}
