export enum InstanceStates {
  Queueing = 'queueing',
  Provisioning = 'provisioning',
  Starting = 'starting',
  Running = 'running',
  Deleting = 'deleting',
  Deleted = 'deleted',
  Failed = 'failed'
}

export enum InstanceLifetimeLevel {
  Full = 'full',
  Short = 'short',
  Dying = 'dying',
  Failed = 'failed'
}

export class Instance {

  instance_data: any;

  constructor(
    public id: string,
    public user_id: string,
    public name: string,
    public environment_id: string,
    public state: InstanceStates,
    public url: string,
    public lifetime_left?: number,
    public username?: string) {}
}
