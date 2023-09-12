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

// Replicate API response defined in pebbles.views.application_sessions.application_session_fields in the backend
export interface ApplicationSession {
  id: string,
  user_id: string,
  name: string,
  application_id: string,
  state: SessionStates,
  url: string,
  lifetime_left: number,
  username: string,
  log_fetch_pending: boolean,
  created_at: string,
  provisioned_at: string,
  provisioning_config: any,
  session_data: any;
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
