export enum SessionStates {
  Queueing = 'queueing',
  Provisioning = 'provisioning',
  Starting = 'starting',
  Running = 'running',
  Deleting = 'deleting',
  Deleted = 'deleted',
  Failed = 'failed'
}

export enum SessionLifetimeLevel {
  Full = 'full',
  Short = 'short',
  Dying = 'dying',
  Failed = 'failed'
}

export class ApplicationSession {

  session_data: any;

  constructor(
    public id: string,
    public user_id: string,
    public name: string,
    public application_id: string,
    public state: SessionStates,
    public url: string,
    public lifetime_left?: number,
    public username?: string) {}
}

// Replicate API response defined in pebbles.views.application_sessions.application_session_log_fields in the backend
export interface ApplicationSessionLog {
    id: string;
    application_session_id: string;
    log_type: string;
    log_level: string;
    timestamp: number;
    message: string;
}
