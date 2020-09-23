export enum MessageType {
    System = 'system',
    Admin = 'admin',
    Workspace = 'workspace',
}

export class Message {
  constructor(
    public id: string,
    public broadcasted: string,
    public subject: string,
    public message: string,
    public type?: MessageType,
    public date?: string,
    public is_important?: boolean,
    public is_checked?: boolean,
    ) {
  }
}
