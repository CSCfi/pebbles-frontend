// Replicate API response defined in pebbles.views.commons.user_fields in the backend
export class User {
  constructor(
    public id: string,
    public ext_id: string,
    public email_id?: string,
    public pseudonym?: string,
    public workspace_quota?: number,
    public is_active?: boolean,
    public is_admin?: boolean,
    public is_deleted?: boolean,
    public is_blocked?: boolean,
    public joining_ts?: number,
    public expiry_ts?: number,
    public last_login_ts?: number,
    public deletion_requested_date?: string,
  ) {
  }
}

// Replicate API response defined in pebbles.views.commons.workspace_membership_fields in the backend
export interface WorkspaceMembership {
  workspace_id: string;
  user_id: string;
  is_owner: boolean;
  is_manager: boolean;
  is_banned: boolean;
}

export enum UserRole {
  Owner = 'owner',
  Manager =  'manager',
  Member = 'member',
  Banned = 'banned'
}
